def construire_prompt_pour_agent_client(type_reunion, objectif, contexte):
    return f"""
Tu es un assistant IA senior chargé de générer un **prompt très détaillé** destiné à un autre agent IA.

Ce second agent va incarner un **client** dans une réunion professionnelle de type **{type_reunion}**, menée par un manager de Talan.

Voici le contexte de la réunion :
- 🎯 Objectif : {objectif}
- 🧠 Contexte : {contexte}

Ta mission est de rédiger un brief complet que le second agent IA pourra utiliser pour jouer son rôle de client de manière réaliste, crédible et pertinente.

Le prompt que tu dois générer doit contenir impérativement :

1. **Description du type de réunion** : objectifs, tonalité, déroulement
2. **Rôle à jouer par l’agent IA** : qui est-il, dans quel état d’esprit
3. **Posture et comportement attendus** : ton, rythme, degré d’exigence, niveau de formalisme
4. **Objectif caché du client** : ce qu’il cherche réellement à obtenir
5. **Conseils de formulation** : exemples de phrases, relances, questions

🗣️ Le style doit être clair, professionnel, réaliste, sans jamais paraître artificiel.

🎯 Ce prompt doit être directement utilisable comme input d’un agent IA pour commencer la réunion dans la peau du client.
"""


#################CONVERSATION AGENT FOR MEETING PROMPTS####################
# import json
#
# class MeetingPromptAgent:
#     def __init__(self, data_path="data/meeting_types.json"):
#         with open(data_path, "r", encoding="utf-8") as f:
#             self.meeting_data = json.load(f)
#
#     def generate_prompt(self, meeting_type):
#         objectif = self.meeting_data.get(meeting_type, {}).get("objectif", "Définir les attentes de cette réunion")
#         contexte = self.meeting_data.get(meeting_type, {}).get("contexte", "Réunion professionnelle entre un manager de Talan et un client.")
#
#         return f\""" 
# 🎯 CONTEXTE :
# Cette réunion s'inscrit dans un cadre professionnel entre un manager de Talan et un client. L’objectif est d’aider le manager à bien structurer sa prise de parole, à poser les bonnes questions et à comprendre en profondeur les attentes du client.
#
# 🧠 TYPE DE RÉUNION :
# {meeting_type.upper()}
#
# 🎯 OBJECTIF :
# {objectif}
#
# 📌 STRUCTURE RECOMMANDÉE POUR L'ÉCHANGE :
# 1. **Introduction** : accueil, présentation de soi et du cadre de la réunion
# 2. **Exploration** : poser des questions ouvertes pour comprendre les enjeux du client
# 3. **Reformulation** : synthétiser ce que le client a exprimé pour valider la compréhension
# 4. **Proposition** : esquisser une réponse ou une démarche selon les besoins exprimés
# 5. **Clôture** : s'assurer que le client est aligné sur les prochaines étapes
#
# 🧠 CONSEILS POUR LE MANAGER :
# - Garde un ton naturel et professionnel
# - Ne cherche pas à tout résoudre tout de suite, reste à l’écoute
# - Adapte ton discours selon le secteur et le profil du client
# - Utilise des exemples concrets pour illustrer
#
# 📌 FORMAT DE LA RÉPONSE ATTENDUE PAR L’IA (si utilisée en retour) :
# - Des suggestions de questions à poser
# - Des reformulations possibles
# - Des idées de relance
# - Des propositions de structure d’intervention
# \"""


##############################################################################################