import ollama

# Définir le prompt
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

# Appeler LLaMA 3 via Ollama
response = ollama.chat(
    model="llama3",
    messages=[
        {"role": "user", "content": prompt}
    ]
)

# Afficher la réponse
print("\n🗣️ Réponse générée par LLaMA 3 :\n")
print(response['message']['content'].strip())
