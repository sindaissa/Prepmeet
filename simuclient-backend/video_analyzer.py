# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from moviepy import VideoFileClip
import speech_recognition as sr
import librosa
import numpy as np
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from typing import TypedDict, Annotated, Optional
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
import tempfile
import yt_dlp

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GEMINI_API_KEY"))

# Définir l'état du graphe
class VideoAnalysisState(TypedDict):
    video_path: str
    audio_path: Optional[str]
    transcription: Optional[str]
    vocal_analysis: Optional[dict]
    semantic_analysis: Optional[dict]
    final_result: Optional[dict]
    error: Optional[str]
    messages: Annotated[list, add_messages]

class VideoAnalyzer:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.graph = self._build_graph()
    
    def _build_graph(self):
        """Construire le graphe d'analyse vidéo"""
        workflow = StateGraph(VideoAnalysisState)
        
        # Ajouter les nœuds
        workflow.add_node("extract_audio", self.extract_audio_node)
        workflow.add_node("transcribe_audio", self.transcribe_audio_node)
        workflow.add_node("analyze_vocal_features", self.analyze_vocal_features_node)
        workflow.add_node("analyze_semantic_content", self.analyze_semantic_content_node)
        workflow.add_node("finalize_results", self.finalize_results_node)
        workflow.add_node("handle_error", self.handle_error_node)
        
        # Définir les connexions
        workflow.add_edge(START, "extract_audio")
        workflow.add_conditional_edges(
            "extract_audio",
            self._check_audio_extraction,
            {
                "success": "transcribe_audio",
                "error": "handle_error"
            }
        )
        workflow.add_conditional_edges(
            "transcribe_audio",
            self._check_transcription,
            {
                "success": "analyze_vocal_features",
                "error": "analyze_vocal_features"  # Continue même si transcription échoue
            }
        )
        workflow.add_edge("analyze_vocal_features", "analyze_semantic_content")
        workflow.add_edge("analyze_semantic_content", "finalize_results")
        workflow.add_edge("finalize_results", END)
        workflow.add_edge("handle_error", END)
        
        return workflow.compile()
    
    def _check_audio_extraction(self, state: VideoAnalysisState) -> str:
        """Vérifier si l'extraction audio a réussi"""
        return "success" if state.get("audio_path") and not state.get("error") else "error"
    
    def _check_transcription(self, state: VideoAnalysisState) -> str:
        """Vérifier si la transcription a réussi"""
        return "success" if state.get("transcription") and "Transcription non disponible" not in state["transcription"] else "error"
    
    def extract_audio_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour extraire l'audio de la vidéo"""
        try:
            video_path = state["video_path"]
            
            # Gérer les URLs YouTube
            if "youtube.com" in video_path or "youtu.be" in video_path:
                audio_path = self._download_youtube_audio(video_path)
            else:
                # Fichier vidéo local
                audio_path = self._extract_local_audio(video_path)
            
            return {
                **state,
                "audio_path": audio_path,
                "messages": [HumanMessage(content=f"Audio extrait avec succès: {audio_path}")]
            }
        except Exception as e:
            return {
                **state,
                "error": f"Erreur extraction audio: {str(e)}",
                "messages": [HumanMessage(content=f"Erreur extraction audio: {str(e)}")]
            }
    
    def _download_youtube_audio(self, url: str) -> str:
        """Télécharger l'audio depuis YouTube"""
        temp_audio = tempfile.mktemp(suffix=".wav")
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': temp_audio.replace('.wav', '.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
                'preferredquality': '192',
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        return temp_audio
    
    def _extract_local_audio(self, video_path: str) -> str:
        """Extraire l'audio d'un fichier vidéo local"""
        temp_audio = tempfile.mktemp(suffix=".wav")
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(temp_audio, codec='pcm_s16le', logger=None)
        return temp_audio
    
    def transcribe_audio_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour transcrire l'audio"""
        try:
            audio_path = state["audio_path"]
            
            with sr.AudioFile(audio_path) as source:
                audio = self.recognizer.record(source)
                try:
                    text = self.recognizer.recognize_google(audio, language="fr-FR")
                    return {
                        **state,
                        "transcription": text,
                        "messages": state["messages"] + [HumanMessage(content=f"Transcription réussie: {text[:100]}...")]
                    }
                except sr.UnknownValueError:
                    return {
                        **state,
                        "transcription": "Transcription non disponible",
                        "messages": state["messages"] + [HumanMessage(content="Transcription non disponible")]
                    }
                except sr.RequestError as e:
                    return {
                        **state,
                        "transcription": f"Erreur de requête: {e}",
                        "messages": state["messages"] + [HumanMessage(content=f"Erreur de requête: {e}")]
                    }
        except Exception as e:
            return {
                **state,
                "transcription": "Erreur de transcription",
                "error": str(e),
                "messages": state["messages"] + [HumanMessage(content=f"Erreur transcription: {str(e)}")]
            }
    
    def analyze_vocal_features_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour analyser les caractéristiques vocales"""
        try:
            audio_path = state["audio_path"]
            transcription = state.get("transcription")
            
            y, sr_rate = librosa.load(audio_path)
            volume = float(np.mean(librosa.feature.rms(y=y)[0]))
            duration = float(librosa.get_duration(y=y, sr=sr_rate))
            
            pace = 0
            if transcription and transcription != "Transcription non disponible":
                word_count = len(transcription.split())
                pace = word_count / duration if duration > 0 else 0
            
            vocal_analysis = {
                "tone": "neutre",
                "pace": pace,
                "volume": volume,
                "duration": duration
            }
            
            return {
                **state,
                "vocal_analysis": vocal_analysis,
                "messages": state["messages"] + [HumanMessage(content=f"Analyse vocale terminée. Volume: {volume:.3f}, Rythme: {pace:.2f} mots/sec")]
            }
        except Exception as e:
            return {
                **state,
                "vocal_analysis": {"error": str(e)},
                "messages": state["messages"] + [HumanMessage(content=f"Erreur analyse vocale: {str(e)}")]
            }
    
    def analyze_semantic_content_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour analyser le contenu sémantique"""
        try:
            transcription = state.get("transcription")
            
            if not transcription or transcription == "Transcription non disponible":
                semantic_analysis = {
                    "topics": "Non déterminé",
                    "sentiment": "Non déterminé",
                    "clarity": 0.0
                }
            else:
                prompt = f"""
                Analysez le texte suivant et fournissez une analyse sémantique :
                Texte : {transcription}
                
                RÉPONDEZ UNIQUEMENT avec un JSON valide dans ce format exact :
                {{
                    "topics": "thèmes principaux séparés par des virgules",
                    "sentiment": "sentiment général: positif, neutre, négatif",
                    "clarity": 0.8
                }}
                """
                
                response = llm.invoke([HumanMessage(content=prompt)])
                content = response.content.strip()
                
                # Nettoyer la réponse pour extraire le JSON
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                try:
                    semantic_analysis = json.loads(content)
                except json.JSONDecodeError:
                    # Fallback si le parsing JSON échoue
                    semantic_analysis = {
                        "topics": "Erreur de parsing",
                        "sentiment": "Non déterminé",
                        "clarity": 0.0
                    }
            
            return {
                **state,
                "semantic_analysis": semantic_analysis,
                "messages": state["messages"] + [HumanMessage(content=f"Analyse sémantique terminée: {semantic_analysis.get('sentiment', 'N/A')}")]
            }
        except Exception as e:
            return {
                **state,
                "semantic_analysis": {"error": str(e)},
                "messages": state["messages"] + [HumanMessage(content=f"Erreur analyse sémantique: {str(e)}")]
            }
    
    def finalize_results_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour finaliser les résultats"""
        final_result = {
            "vocal_analysis": state.get("vocal_analysis", {}),
            "semantic_analysis": state.get("semantic_analysis", {}),
            "transcription": state.get("transcription", ""),
            "status": "completed"
        }
        
        return {
            **state,
            "final_result": final_result,
            "messages": state["messages"] + [HumanMessage(content="Analyse vidéo terminée avec succès")]
        }
    
    def handle_error_node(self, state: VideoAnalysisState) -> VideoAnalysisState:
        """Nœud pour gérer les erreurs"""
        error_result = {
            "error": state.get("error", "Erreur inconnue"),
            "status": "failed"
        }
        
        return {
            **state,
            "final_result": error_result,
            "messages": state["messages"] + [HumanMessage(content=f"Erreur: {state.get('error', 'Erreur inconnue')}")]
        }
    
    def analyze_video(self, video_path: str, output_json_path: str = "analysis_result.json") -> dict:
        """Analyser une vidéo en utilisant le graphe LangGraph"""
        initial_state = VideoAnalysisState(
            video_path=video_path,
            audio_path=None,
            transcription=None,
            vocal_analysis=None,
            semantic_analysis=None,
            final_result=None,
            error=None,
            messages=[]
        )
        
        # Exécuter le graphe
        final_state = self.graph.invoke(initial_state)
        
        # Sauvegarder les résultats
        if final_state.get("final_result"):
            with open(output_json_path, 'w', encoding='utf-8') as f:
                json.dump(final_state["final_result"], f, ensure_ascii=False, indent=4)
            
            print(f"Analyse sauvegardée dans {output_json_path}")
        
        return final_state["final_result"]
    
    def get_graph_visualization(self):
        """Obtenir une représentation textuelle du graphe"""
        return """
        Graphe d'Analyse Vidéo LangGraph:
        
        START → extract_audio → transcribe_audio → analyze_vocal_features → analyze_semantic_content → finalize_results → END
                      ↓                    ↓
                  handle_error ────────────┘
        """

# Fonction utilitaire pour utilisation simple
def analyze_video_with_langgraph(video_path: str, output_json_path: str = "analysis_result.json") -> dict:
    """Fonction utilitaire pour analyser une vidéo"""
    analyzer = VideoAnalyzer()
    return analyzer.analyze_video(video_path, output_json_path)

# Exemple d'utilisation
if __name__ == "__main__":
    # Créer l'analyseur
    analyzer = VideoAnalyzer()
    
    # Afficher la structure du graphe
    print(analyzer.get_graph_visualization())
    
    # Analyser une vidéo
    video_path = "./vid_ia.mp4"
    result = analyzer.analyze_video(video_path)
    
    print("\n=== RÉSULTATS D'ANALYSE ===")
    print(json.dumps(result, ensure_ascii=False, indent=2))