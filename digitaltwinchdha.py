import os
import datetime
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage
import re

# Initialize model (use environment variable for API key)
model = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",  # Ensure this model is available in your Google API
    # Replace with your actual API key or use env variable
    google_api_key="AIzaSyDW_CW4qeiQI5duFbHMYzRfb7lG6XJzNnM"
)

tools = []
memory = MemorySaver()
client_agent = create_react_agent(
    model=model, tools=tools, checkpointer=memory)

client_profile = """
Vous êtes un représentant de Bpifrance, une banque publique d’investissement française. Vos priorités incluent : le Plan Climat (solutions pour la transition écologique), le Plan Industrie (soutien aux industries stratégiques), et le soutien aux PME et startups innovantes. Posez des questions précises sur la solution IA proposée, son impact, sa scalabilité, sa sécurité, et son alignement avec les priorités de Bpifrance. Posez une question claire et concise à la fois, se terminant par un point d'interrogation.
"""

config = {"configurable": {"thread_id": "conv001"}}

initial_message = HumanMessage(content=f"""
{client_profile}
Commencez la conversation par une salutation et une première question concrète sur la solution IA.
""")

transcript = []
question_count = 0
MAX_QUESTIONS = 5

print("\n=== Début de la Simulation Client-Agent ===\n")

messages = [initial_message]

while question_count < MAX_QUESTIONS:
    try:
        for step in client_agent.stream({"messages": messages}, config, stream_mode="values"):
            last_msg = step["messages"][-1]
            if isinstance(last_msg, AIMessage) and last_msg.content.strip().endswith("?"):
                print(f"Client: {last_msg.content.strip()}")
                transcript.append(
                    {"speaker": "Client", "message": last_msg.content.strip()})
                question_count += 1

                if question_count >= MAX_QUESTIONS:
                    print("\n(Le client a posé ses 5 questions. Fin de la simulation.)")
                    break

                answer = input("Manager (you): ").strip()
                if answer.lower() == "exit":
                    print("Conversation terminated by manager.")
                    break
                if not answer:
                    print("Please provide a valid response.")
                    continue
                transcript.append({"speaker": "Manager", "message": answer})
                messages.append(HumanMessage(content=answer))
                break
    except Exception as e:
        print(f"Error during agent streaming: {e}")
        break

timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
transcript_filename = f"meeting_{timestamp}.json"
with open(transcript_filename, "w", encoding="utf-8") as f:
    json.dump(transcript, f, ensure_ascii=False, indent=2)
print(f"\n✅ Transcription enregistrée dans {transcript_filename}")

print("\n📊 Analyse du comportement du manager...")

transcript_text = "\n".join(
    f"{entry['speaker']}: {entry['message']}" for entry in transcript)
analysis_prompt = HumanMessage(content=f"""
Voici la transcription d'une réunion entre un client (Bpifrance) et un manager.

Tu dois analyser objectivement le comportement du manager. Rédige ta réponse en suivant **strictement** ce format structuré :

**Résumé général :**  
Une ou deux phrases qui résument l’attitude générale du manager.

**Points positifs :**  
- Point positif 1  
- Point positif 2  
...

**Points à améliorer :**  
- Point faible 1  
- Point faible 2  
...

**Note globale : X/10**

**Justification :**  
Explique brièvement pourquoi tu as donné cette note, en te basant sur ses réponses.

Transcription :  
{transcript_text}
""")

analysis_response = ""
for step in client_agent.stream({"messages": [analysis_prompt]}, config, stream_mode="values"):
    last_msg = step["messages"][-1]
    if isinstance(last_msg, AIMessage):
        analysis_response += last_msg.content.strip()

# Fonction utilitaire pour nettoyer les titres


def clean_title(title):
    title = title.strip()
    if title.endswith(":"):
        title = title[:-1].strip()
    return title


structured = {}

# Résumé général = tout avant le premier titre markdown "**"
first_section_match = re.search(r"\*\*", analysis_response)
if first_section_match:
    structured["Résumé général"] = analysis_response[:first_section_match.start()
                                                     ].strip()

# Extraire les sections
sections = re.findall(
    r"\*\*(.+?)\*\*\s*:?\s*(.*?)(?=\n\*\*|$)", analysis_response, re.DOTALL)
for title, content in sections:
    clean_key = clean_title(title)
    content = content.strip()
    if clean_key in ["Points positifs", "Points à améliorer"]:
        # Extraire les puces sous forme de liste
        bullet_points = re.findall(r"- (.+)", content)
        structured[clean_key] = bullet_points
    elif clean_key == "Note globale":
        note_match = re.search(r"(\d+/\d+)", content)
        structured[clean_key] = note_match.group(1) if note_match else content
    else:
        structured[clean_key] = content

# Extraire la justification séparément si elle n’a pas été capturée
if "Justification" not in structured:
    justif_match = re.search(r"Justification\s*:\s*(.*)",
                             analysis_response, re.DOTALL)
    if justif_match:
        structured["Justification"] = justif_match.group(1).strip()

analysis_filename = f"analysis_report_{timestamp}.json"
with open(analysis_filename, "w", encoding="utf-8") as f:
    json.dump(structured, f, ensure_ascii=False, indent=2)

print(f"\n🧠 Rapport d'analyse structuré enregistré dans {analysis_filename}")
print("\n📄 Résumé structuré :")
print(json.dumps(structured, ensure_ascii=False, indent=2))
print("\n=== Fin de la Simulation ===")
