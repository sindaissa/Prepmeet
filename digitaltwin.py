import chromadb
import uuid
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

LLM_MODEL = "gemini-1.5-flash"
COLLECTION_NAME = "client_meeting_prep"
GOOGLE_API_KEY = "AIzaSyCmwhkDmdtjjNLQX8Er2XL3ZON2PnGOzzI"


class ClientMeetingAgent:
    def __init__(self, client_name, meeting_type, project_desc):
        """Initialize the client meeting agent with context."""
        self.client_name = client_name
        self.meeting_type = meeting_type
        self.project_desc = project_desc
        self.messages = []
        # Generate unique thread_id for session
        self.thread_id = str(uuid.uuid4())

        # Initialize Chroma collection
        self.collection = self._get_chroma_collection()
        if not self.collection:
            raise ValueError(
                f"Collection '{COLLECTION_NAME}' not found. Run initialize_chroma.py first.")

        # Retrieve context
        self.context = self._retrieve_client_context()

        # Initialize model and LangGraph agent - Fixed configuration
        self.model = ChatGoogleGenerativeAI(
            model=LLM_MODEL,
            google_api_key=GOOGLE_API_KEY,
            temperature=0.7,
            # Move generation_config to model_kwargs
            model_kwargs={
                "top_k": 50,
                "top_p": 0.9,
                "max_output_tokens": 2048
            }
        )
        tools = []
        memory = MemorySaver()
        self.agent = create_react_agent(
            model=self.model,
            tools=tools,
            checkpointer=memory
        )

        self.system_prompt = f"""
        Vous êtes le jumeau numérique de {self.client_name}. Vous participez à une réunion de type '{self.meeting_type}'.
        Description du projet: {self.project_desc}
        
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
        {self.context}
        """

        # Initialize conversation
        self.messages.append({
            "role": "assistant",
            "content": f"Prêt pour la réunion avec {self.client_name} sur le projet '{self.project_desc}'!"
        })

    def _get_chroma_collection(self):
        """Retrieve the Chroma collection."""
        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        try:
            return chroma_client.get_collection(COLLECTION_NAME)
        except Exception as e:
            print(
                f"Erreur: Collection '{COLLECTION_NAME}' non trouvée. Erreur: {str(e)}")
            return None

    def _retrieve_client_context(self):
        """Retrieve context from Chroma based on client details with timeout handling."""
        query_text = f"""
        Client: {self.client_name}
        Type de réunion: {self.meeting_type}
        Description du projet: {self.project_desc}
        Objectif: Préparation de réunion
        """
        try:
            # Add timeout handling for Chroma query
            results = self.collection.query(
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
            print("Utilisation du contexte par défaut...")
        return "Aucune donnée contextuelle spécifique trouvée."

    def interact(self, user_input):
        """Process user input and return the agent's response."""
        self.messages.append({"role": "user", "content": user_input})

        # Prepare messages for LangGraph agent
        messages = [{"role": "system", "content": self.system_prompt}]
        for msg in self.messages:
            if msg["role"] == "user":
                messages.append({"role": "human", "content": msg["content"]})
            elif msg["role"] == "assistant":
                messages.append({"role": "ai", "content": msg["content"]})

        # Fixed: Properly configure the agent invocation
        config = {"configurable": {"thread_id": self.thread_id}}

        try:
            response = self.agent.invoke(
                {"messages": messages},
                config=config
            )
            response_content = response["messages"][-1].content
        except Exception as e:
            print(f"Erreur détaillée: {str(e)}")
            response_content = f"Erreur de génération: {str(e)}"

        self.messages.append(
            {"role": "assistant", "content": response_content})
        return response_content


if __name__ == "__main__":
    # Example usage
    try:
        agent = ClientMeetingAgent(
            client_name="Millésima",
            meeting_type="réunion de suivi",
            project_desc="développement de la plateforme e-commerce avec intégration ERP"
        )

        print(agent.messages[0]["content"])  # Print initial message

        # Simulate interaction
        while True:
            user_input = input("Votre message (ou 'quit' pour sortir): ")
            if user_input.lower() == 'quit':
                break
            response = agent.interact(user_input)
            print(f"Agent: {response}")

    except Exception as e:
        print(f"Erreur d'initialisation: {str(e)}")
        print(
            "Vérifiez que ChromaDB est correctement configuré et que la collection existe.")
