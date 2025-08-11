import os
import json
from dotenv import load_dotenv
from agents import MeetingPromptAgent, GeminiInteractionAgent

# Charger la clé API
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("❌ Clé API manquante. Vérifiez le fichier .env.")
    exit(1)

# Charger les types de réunion
with open("data/meeting_types.json", "r", encoding="utf-8") as f:
    MEETING_TYPES = json.load(f)

def choisir_type_reunion():
    print("\n📌 Sélectionnez le type de réunion :")
    for i, key in enumerate(MEETING_TYPES.keys(), 1):
        print(f"{i}. {key}")
    print(f"{len(MEETING_TYPES) + 1}. Autre")

    while True:
        try:
            choix = int(input("\nEntrez le numéro : "))
            if 1 <= choix <= len(MEETING_TYPES):
                return list(MEETING_TYPES.keys())[choix - 1]
            elif choix == len(MEETING_TYPES) + 1:
                return input("Entrez le nom de votre type de réunion personnalisée : ")
            else:
                print("❌ Choix invalide.")
        except ValueError:
            print("❌ Veuillez entrer un numéro valide.")

def main():
    print("🤖 Bienvenue dans l'Agent IA de Prompting pour Réunions Talan\n")
    type_reunion = choisir_type_reunion()

    prompt_agent = MeetingPromptAgent()
    meta_prompt = prompt_agent.generate_prompt(type_reunion)

    gemini_agent = GeminiInteractionAgent(api_key=GOOGLE_API_KEY)
    chat = gemini_agent.get_chat()

    print("\n🧠 Initialisation de la conversation IA...\n")
    response = chat.send_message(meta_prompt)
    print(f"IA 🧠 : {response.text}\n")

    print("💬 Tu peux maintenant discuter avec l’IA. Tape 'exit' pour quitter.\n")

    while True:
        user_input = input("👔 Toi : ")
        if user_input.lower() in ["exit", "quit"]:
            print("🚪 Fin de la conversation.")
            break
        response = chat.send_message(user_input)
        print(f"\n🤖 IA : {response.text}\n")

if __name__ == "__main__":
    main()
