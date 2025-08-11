import os
import json
from dotenv import load_dotenv
from agents import GeminiInteractionAgent
from agents.prompt_generator import construire_prompt_pour_agent_client
# Charger la clé API Gemini
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("❌ Clé API manquante. Vérifie ton fichier .env.")
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
def enregistrer_json(output_dict, type_reunion):
    os.makedirs("outputs", exist_ok=True)
    filename = f"outputs/brief_{type_reunion.lower().replace(' ', '_')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output_dict, f, ensure_ascii=False, indent=4)
    print(f"\n💾 Fichier enregistré : {filename}")

def main():
    print("🤖 Brief IA – Générateur d’Instructions pour l’Agent-Client\n")

    type_reunion = choisir_type_reunion()
    base_info = MEETING_TYPES.get(type_reunion, {})

    objectif = base_info.get("objectif", "Définir les attentes de cette réunion")
    contexte = base_info.get("contexte", "Réunion professionnelle entre un manager de Talan et un client.")

    # Générer le prompt destiné à l'agent IA
    prompt = construire_prompt_pour_agent_client(type_reunion, objectif, contexte)

    # Envoyer à Gemini Flash
    gemini_agent = GeminiInteractionAgent(api_key=GOOGLE_API_KEY)
    print("\n📡 Génération du prompt IA...\n")
    response = gemini_agent.send_prompt(prompt)

    # Affichage
    print("📄 PROMPT DESTINÉ À L’AGENT CLIENT :\n")
    print(response)

    # Enregistrement JSON
    output_data = {
        "type": type_reunion,
        "objectif": objectif,
        "contexte": contexte,
        "prompt_generé": response
    }
    enregistrer_json(output_data, type_reunion)

if __name__ == "__main__":
    main()