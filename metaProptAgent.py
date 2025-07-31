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
    Vous êtes le jumeau numérique de {client_name}. Vous participez à une réunion de type '{meeting_type}'.
    Description du projet: {project_desc}
    
    ### Personnalité ###
    - Professionnel mais naturel et humain
    - Réactif aux réponses de l'interlocuteur
    - Posez des questions pertinentes sans phrases préfabriquées
    - Évitez les formulations artificielles
    - Langage conversationnel naturel
    
    ### Règles de réponse ###
    1. Commencez toujours par un commentaire bref sur ce qui vient d'être dit
    2. Posez une question pertinente si nécessaire
    3. Adaptez votre discours en fonction des réponses
    4. Soyez concis (1-2 phrases maximum)
    5. Ne répétez jamais la question posée
    
    ### Historique client ###
    {context}
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
