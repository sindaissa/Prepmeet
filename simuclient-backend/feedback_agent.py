# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import TypedDict
from collections import Counter
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import re

# Load environment variables
load_dotenv()
os.environ["LANGCHAIN_TRACING_V2"] = "false"

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "default_key_if_not_set"))

app = FastAPI()

# Define Feedback State
class FeedbackState(TypedDict):
    facial_data: dict
    vocal_data: dict
    semantic_data: dict
    digital_twin_data: dict
    score: float
    remarks: list[str]
    advice: list[str]
    scenarios: list[str]

# Request Model
class FeedbackRequest(BaseModel):
    facial_data: str  # JSON string
    vocal_data: str   # JSON string
    semantic_data: str # JSON string
    digital_twin_data: str # JSON string

# Helper function to parse JSON data
def parse_json_data(json_str: str) -> dict:
    try:
        return json.loads(json_str) if json_str else {}
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        return {}

# Load and summarize analysis data
def load_analysis_data(facial_data: dict, vocal_data: dict, semantic_data: dict, digital_twin_data: dict):
    try:
        # Summarize facial data
        facial_summary = {
            "avg_smile": sum(d.get("smile", 0) for d in facial_data) / len(facial_data) if facial_data else 0,
            "avg_frown": sum(d.get("frown", 0) for d in facial_data) / len(facial_data) if facial_data else 0,
            "avg_engagement": sum(d.get("engagement", 0) for d in facial_data) / len(facial_data) if facial_data else 0,
            "smile_count": sum(1 for d in facial_data if d.get("smile", 0) > 0.5) if facial_data else 0,
            "frown_count": sum(1 for d in facial_data if d.get("frown", 0) > 0.5) if facial_data else 0
        }

        # Summarize vocal data
        vocal_summary = {
            "tone_distribution": Counter(d.get("tone", "unknown") for d in vocal_data) if vocal_data else {},
            "avg_pace": sum(1 if d.get("pace", "modéré") == "rapide" else -1 if d.get("pace", "modéré") == "lent" else 0 for d in vocal_data) / len(vocal_data) if vocal_data else 0,
            "avg_volume": sum(d.get("volume", 0.5) for d in vocal_data) / len(vocal_data) if vocal_data else 0.5
        }

        # Summarize semantic data
        semantic_summary = {
            "topic_diversity": len(set(d.get("topics", "") for d in semantic_data)) if semantic_data else 0,
            "avg_clarity": sum(d.get("clarity", 0) for d in semantic_data) / len(semantic_data) if semantic_data else 0,
            "sentiment_distribution": Counter(d.get("sentiment", "unknown") for d in semantic_data) if semantic_data else {},
            "low_clarity_count": sum(1 for d in semantic_data if d.get("clarity", 0) < 0.7) if semantic_data else 0
        }

        # Summarize digital twin data
        digital_twin_summary = {
            "general_summary": digital_twin_data.get("Résumé général", "No summary"),
            "positive_points": digital_twin_data.get("Points positifs", []),
            "improvement_areas": digital_twin_data.get("Points à améliorer", []),
            "advice": digital_twin_data.get("Conseils", []),
            "scenarios": digital_twin_data.get("Scénarios", [])
        }

        print(f"Loaded data - Facial: {facial_summary}, Vocal: {vocal_summary}, Semantic: {semantic_summary}, Digital Twin: {digital_twin_summary}")
        return facial_summary, vocal_summary, semantic_summary, digital_twin_summary
    except Exception as e:
        print(f"Error in load_analysis_data: {str(e)}")
        return {}, {}, {}, {}

# Initialize LLM
llm = None
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)
        print("LLM initialized successfully")
    except Exception as e:
        print(f"Error initializing LLM: {str(e)}")
else:
    print("Error: GEMINI_API_KEY not found in .env")

# Generate feedback
def generate_feedback(state: FeedbackState):
    if not llm:
        return {
            "score": 50.0,
            "remarks": ["Erreur: LLM non initialisé, vérifiez la clé API"],
            "advice": ["Vérifier GEMINI_API_KEY dans .env"],
            "scenarios": ["Reconfigurer la clé API"]
        }

    facial_data = state['facial_data']
    vocal_data = state['vocal_data']
    semantic_data = state['semantic_data']
    digital_twin_data = state['digital_twin_data']

    # Calculate score
    score = 50.0  # Default score
    if facial_data and vocal_data and semantic_data:
        facial_score = (
            facial_data.get('avg_engagement', 0.5) * 0.4 +
            facial_data.get('avg_smile', 0.5) * 0.3 +
            (1 - facial_data.get('avg_frown', 0.5)) * 0.3
        ) * 30
        positive_tones = vocal_data.get('tone_distribution', {})
        positive_count = positive_tones.get('positif', 0) + positive_tones.get('assuré', 0) + positive_tones.get('enthousiaste', 0)
        total_tones = sum(positive_tones.values()) if positive_tones else 1
        vocal_score = (positive_count / total_tones) * 20
        semantic_score = semantic_data.get('avg_clarity', 0.7) * 30
        dt_score = 20.0 if digital_twin_data.get("positive_points") else 10.0
        score = min(100, max(0, facial_score + vocal_score + semantic_score + dt_score))

    prompt = f"""
    Analysez les données d'une simulation manager-client et fournissez un feedback structuré.

    DONNÉES:
    - Facial: engagement moyen={facial_data.get('avg_engagement', 0)}, sourires={facial_data.get('smile_count', 0)}, froncements={facial_data.get('frown_count', 0)}
    - Vocal: tons positifs={vocal_data.get('tone_distribution', {}).get('positif', 0)}, volume moyen={vocal_data.get('avg_volume', 0)}
    - Sémantique: clarté moyenne={semantic_data.get('avg_clarity', 0)}, éléments peu clairs={semantic_data.get('low_clarity_count', 0)}
    - Digital Twin: {digital_twin_data.get('general_summary', 'Pas de résumé')}

    RÉPONSE AU FORMAT SUIVANT (respectez exactement cette structure):

    SCORE: {int(score)}

    REMARQUES:
    - [Observez les métriques faciales, vocales et sémantiques]
    - [Identifiez les points forts et faibles]
    - [Commentez l'engagement et la communication]

    CONSEILS:
    - [Donnez des conseils d'amélioration concrets]
    - [Suggérez des techniques spécifiques]

    SCÉNARIOS:
    - [Proposez des scénarios d'entraînement futurs]
    - [Adaptez aux points d'amélioration identifiés]
    """

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        print(f"Raw LLM response: {content}")

        lines = [line.strip() for line in content.split('\n') if line.strip()]
        parsed_score = score
        remarks = []
        advice = []
        scenarios = []
        current_section = None

        for line in lines:
            line_upper = line.upper()
            if 'SCORE:' in line_upper:
                try:
                    score_match = re.search(r'(\d+)', line)
                    if score_match:
                        parsed_score = float(score_match.group(1))
                except:
                    pass
                continue
            elif 'REMARQUE' in line_upper:
                current_section = 'remarks'
                continue
            elif 'CONSEIL' in line_upper:
                current_section = 'advice'
                continue
            elif 'SCÉNARIO' in line_upper:
                current_section = 'scenarios'
                continue
            if line.startswith('-') or line.startswith('•'):
                clean_line = line[1:].strip()
                if clean_line:
                    if current_section == 'remarks':
                        remarks.append(clean_line)
                    elif current_section == 'advice':
                        advice.append(clean_line)
                    elif current_section == 'scenarios':
                        scenarios.append(clean_line)

        if not remarks:
            remarks = [
                f"Engagement facial: {facial_data.get('avg_engagement', 0):.1%}",
                f"Clarté sémantique: {semantic_data.get('avg_clarity', 0):.1%}",
                f"Tons positifs: {vocal_data.get('tone_distribution', {}).get('positif', 0)}"
            ]
        if not advice:
            advice = ["Améliorer l'engagement non-verbal", "Travailler la clarté du discours"]
        if not scenarios:
            scenarios = ["Simulation gestion d'objections", "Entraînement technique", "Exercices communication"]

        return {
            "score": parsed_score,
            "remarks": remarks[:5],
            "advice": advice[:4],
            "scenarios": scenarios[:5]
        }
    except Exception as e:
        print(f"Error in generate_feedback: {str(e)}")
        return {
            "score": score,
            "remarks": [f"Erreur: {str(e)}", "Vérifiez les données fournies"],
            "advice": ["Revoir la configuration", "Contacter le support"],
            "scenarios": ["Tester avec données minimales"]
        }

# API Endpoint
@app.post("/generate-feedback")
async def generate_feedback_endpoint(request: FeedbackRequest):
    facial_data = parse_json_data(request.facial_data)
    vocal_data = parse_json_data(request.vocal_data)
    semantic_data = parse_json_data(request.semantic_data)
    digital_twin_data = parse_json_data(request.digital_twin_data)

    facial_summary, vocal_summary, semantic_summary, digital_twin_summary = load_analysis_data(
        facial_data, vocal_data, semantic_data, digital_twin_data
    )

    state = FeedbackState(
        facial_data=facial_summary,
        vocal_data=vocal_summary,
        semantic_data=semantic_summary,
        digital_twin_data=digital_twin_summary,
        score=0.0,
        remarks=[],
        advice=[],
        scenarios=[]
    )

    result = generate_feedback(state)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)