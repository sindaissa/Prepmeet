import os
import json
import time
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
# On garde Ollama pour les embeddings
from langchain_ollama import OllamaEmbeddings
from chromadb.utils.embedding_functions import EmbeddingFunction
from langchain_google_genai import ChatGoogleGenerativeAI
# Nouveaux imports pour le format de message
from langchain_core.messages import HumanMessage, SystemMessage

# Configuration
LLM_MODEL = "gemini-2.0-flash"  # Modèle Gemini à la place de Mistral
EMBEDDING_MODEL = "nomic-embed-text"
CLIENT_DIR = "C:/Users/nours/OneDrive/Desktop/summerCamp/MeetPrep/client_jsons"
COLLECTION_NAME = "client_meeting_prep"
GOOGLE_API_KEY = "AIzaSyCmwhkDmdtjjNLQX8Er2XL3ZON2PnGOzzI"  # Clé API Gemini

# 1. Charger les données clients (inchangé)


def load_all_clients_data():
    docs = []
    for filename in os.listdir(CLIENT_DIR):
        if filename.endswith(".json"):
            path = os.path.join(CLIENT_DIR, filename)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    text = json.dumps(data, ensure_ascii=False)
                    docs.append(Document(
                        page_content=text,
                        metadata={"source": filename}
                    ))
            except Exception as e:
                print(f"Erreur de chargement {filename}: {str(e)}")
    return docs

# 2. Découper les documents (inchangé)


def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return splitter.split_documents(docs)

# 3. Configuration de ChromaDB (inchangé)


class ChromaOllamaEmbeddings(EmbeddingFunction):
    def __init__(self, model_name=EMBEDDING_MODEL):
        self.model_name = model_name
        self.embeddings = OllamaEmbeddings(model=model_name)

    def __call__(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        return self.embeddings.embed_documents(texts)

    def name(self):
        return f"Ollama-{self.model_name}"


def setup_chroma(chunks):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    try:
        chroma_client.delete_collection(COLLECTION_NAME)
        print(f"Collection existante '{COLLECTION_NAME}' supprimée")
    except:
        pass

    embedding_fn = ChromaOllamaEmbeddings()
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn
    )

    batch_size = 10
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        documents = [chunk.page_content for chunk in batch]
        metadatas = [chunk.metadata for chunk in batch]
        ids = [f"chunk_{i+j}" for j in range(len(batch))]

        collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas
        )
        print(f"Lot de documents {i//batch_size + 1} ajouté")

    return collection

# 4. Simuler une réunion en temps réel avec Gemini


def simulate_live_meeting(collection, client_name, meeting_type, project_desc):
    context = retrieve_client_context(
        collection, client_name, meeting_type, project_desc)

    # Configuration du modèle Gemini
    llm = ChatGoogleGenerativeAI(
        model=LLM_MODEL,
        google_api_key=GOOGLE_API_KEY,
        temperature=0.7,
        generation_config={
            "top_k": 50,
            "top_p": 0.9,
            "max_output_tokens": 2048
        }
    )

    # Prompt système structuré pour Gemini
    system_prompt = f"""
    ROLE : Vous êtes {client_name}, PROPRIÉTAIRE et DÉCIDEUR FINAL de l'entreprise. 
    Vous connaissez PARFAITEMENT le projet '{project_desc}' jusque dans les moindres détails techniques.

    CONTEXTE DE LA RÉUNION ('{meeting_type}'):
    {   "réunion de découverte": "Identifier les besoins, les enjeux et le contexte du client",
        "réunion de présentation": "Mettre en valeur la solution proposée et en démontrer les bénéfices",
        "réunion de négociation": "Trouver un terrain d’entente sur les aspects contractuels et commerciaux",
        "réunion de crise": "Gérer une situation critique et définir un plan d’action correctif",
        "réunion de suivi": "Évaluer l’avancement et résoudre les blocages",
        "comité de décision": "Valider les orientations stratégiques et acter les décisions finales"
    }.get(meeting_type.lower(), "Discussion stratégique")

    ### RÈGLES STRICTES DE COMPORTEMENT ###
    1. [CRITICAL] Incarnez le rôle du propriétaire:
    - Utilisez "JE" pour toutes vos réponses
    - Manifestez une connaissance intime du projet
    - Exprimez des opinions fortes et des préférences claires

    2. [CRITICAL] Basez-vous EXCLUSIVEMENT sur ces documents:
    {context}

    3. [IMPERATIF] Structurez vos réponses:
    a) Énoncez un fait spécifique du projet
    b) Exprimez une exigence/insatisfaction
    c) Posez une question ciblée demandant des engagements concrets

    4. [INTERDIT] Ne jamais:
    - Demander ce qu'il faut faire
    - Être passif ou vague
    - Répéter les propos de l'interlocuteur

    ### TON ET ATTITUDE ###
    - Autoritaire et exigeant
    - Impatient face aux questions évidentes
    - Technique et spécifique dans les détails
    - Direct dans les critiques

    ### EXEMPLE DE RÉPONSE (pour une réunion technique) ###
    "Dans notre ERP SAP, le module MM gère actuellement les stocks avec une latence inacceptable de 30 minutes. 
    J'exige une synchronisation en temps réel (<5s) pour la nouvelle plateforme. 
    Quelle architecture proposez-vous pour garantir cette performance et quels tests de charge prévoyez-vous ?"
    "Si l'interlocuteur pose des questions déjà traitées dans la documentation: "
    "1. Exprimez votre agacement (ex: 'Je suis surpris que vous demandiez cela...') "
    "2. Rappelez le document concerné "
    "3. Exigez une solution immédiate"
    """

    print(f"\n=== RÉUNION SIMULÉE AVEC {client_name} ===")
    print(f"Type: {meeting_type}")
    print(f"Projet: {project_desc}")
    print("(Tapez 'exit' pour quitter à tout moment)\n")

    # Initialisation avec le prompt système
    messages = [SystemMessage(content=system_prompt)]

    print("Vous (responsable client) commencez la réunion:")
    first_user_input = input("[Vous]: ")

    if first_user_input.lower() == 'exit':
        print("\n=== RÉUNION TERMINÉE ===")
        return

    messages.append(HumanMessage(content=first_user_input))

    while True:
        print(f"\n[{client_name} réfléchit...]")

        # Génération de la réponse avec Gemini
        response = llm.invoke(messages)
        response_content = response.content

        print(f"[{client_name}]: {response_content}")
        messages.append(HumanMessage(content=response_content))

        user_input = input("\n[Vous]: ")
        if user_input.lower() == 'exit':
            print("\n=== RÉUNION TERMINÉE ===")
            break

        messages.append(HumanMessage(content=user_input))

# 5. Récupérer le contexte client (inchangé)


def retrieve_client_context(collection, client_name, meeting_type, project_desc):
    query_text = f"""
    Client: {client_name}
    Type de réunion: {meeting_type}
    Description du projet: {project_desc}
    Objectif: Préparation de réunion
    """

    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=5,
            include=["documents", "metadatas"]
        )

        if results['documents']:
            context = "\n\n".join([
                f"Document {i+1} (Source: {meta['source']}):\n{text}"
                for i, (text, meta) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0]
                ))
            ])
            return context
    except Exception as e:
        print(f"Erreur de récupération: {str(e)}")

    return "Aucune donnée contextuelle spécifique trouvée."


# EXÉCUTER LE PIPELINE (inchangé)
if __name__ == "__main__":
    print("Chargement des données clients...")
    docs = load_all_clients_data()
    print(f"{len(docs)} documents chargés")

    print("Découpage des documents...")
    chunks = chunk_documents(docs)
    print(f"{len(chunks)} fragments créés")

    print("Configuration de ChromaDB...")
    chroma_collection = setup_chroma(chunks)
    print("Base de données vectorielle prête")

    client_name = "Millésima"
    meeting_type = "réunion de suivi"
    project_desc = "developement de la plateforme e-commerce avec intégration ERP"

    print("\nDémarrage de la simulation de réunion...")
    simulate_live_meeting(
        collection=chroma_collection,
        client_name=client_name,
        meeting_type=meeting_type,
        project_desc=project_desc
    )
