# assistant_agent.py
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langgraph_agent import build_agent_graph

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialiser le modèle Gemini ici (juste une fois)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Créer le graphe LangGraph avec le LLM
agent_graph = build_agent_graph(model)

def assistant_response(client_name, meeting_type, project_topic, question):
    inputs = {
        "client_name": client_name,
        "meeting_type": meeting_type,
        "project_topic": project_topic,
        "question": question
    }
    try:
        result = agent_graph.invoke(inputs)
        return result.get("response", "Aucune réponse générée.")
    except Exception as e:
        return f"[Erreur LangGraph] : {e}"

                                                                               
                


    








