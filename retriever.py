import json

def fetch_relevant_info(client_name, question):
    try:
        with open(f"Clients/{client_name.lower()}.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        # Filtrage intelligent (modulable selon structure JSON)
        keys_to_keep = ["objectif", "problématique", "solution", "secteur"]
        filtered = {k: v for k, v in data.items() if k.lower() in keys_to_keep}

        if not filtered:
            filtered = data  # fallback : tout renvoyer si filtrage vide

        return "\n".join([f"{k}: {v}" for k, v in filtered.items()])
    except FileNotFoundError:
        return "Informations client non trouvées."

