import google.generativeai as genai

# ==== CONFIGURATION DE L'API ====
API_KEY = "AIzaSyAMzr-cfBmVYZdUoyheDPlv3VcSCOHAUq0"  # Remplace par ta clé API Gemini
genai.configure(api_key=API_KEY)

# ==== INITIALISATION DU MODÈLE ====
model = genai.GenerativeModel("gemini-2.0-flash")  # ou "gemini-2.0-flash" si tu veux plus rapide

# ==== PROMPT POUR LA SIMULATION DE RÉUNION ====
prompt = """
Tu es un représentant commercial de Talan, une entreprise de conseil en transformation digitale. Tu es en réunion avec un client potentiel, responsable formation dans une grande entreprise, qui s'intéresse à une solution de formation des managers basée sur l’intelligence artificielle.

Le client est sceptique : il utilise déjà des formations classiques et pense que l’IA ne peut pas apporter beaucoup plus. Il souhaite des preuves concrètes, mais reste poli.

Voici sa question en début de réunion :
"Pourquoi devrais-je faire confiance à votre solution d’IA pour former mes managers, alors que nos méthodes actuelles fonctionnent déjà très bien ?"

Ta mission : répondre de manière réaliste, professionnelle et convaincante.

Contraintes :
- Tu dois rester calme et crédible, sans paraître trop vendeur.
- Ta réponse doit intégrer les avantages spécifiques d'une IA comme SimuClient : simulation réaliste, avatar interactif, analyse des émotions, feedback personnalisé, etc.
- Ta réponse ne doit pas excéder 250 mots.
- Tu dois adapter ton ton à un client sceptique, intelligent et bienveillant.

Réponds maintenant comme si tu étais en train de parler à voix haute dans une vraie réunion.
"""

# ==== GÉNÉRATION DE LA RÉPONSE ====
response = model.generate_content(prompt)
print("\n=== Réponse de Gemini (Simulation de réunion) ===\n")
print(response.text.strip())
