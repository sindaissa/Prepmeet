# langgraph_agent.py
from langgraph.graph import StateGraph
from langchain_core.runnables import RunnableLambda

from retriever import fetch_relevant_info
from prompt_generator import generate_prompt

# ----------- Nœuds de traitement -----------

def fetch_context_node(state: dict) -> dict:
    context = fetch_relevant_info(state["client_name"], state["question"])
    state["context"] = context
    return state

def generate_response_node(llm):
    def _run(state: dict) -> dict:
        prompt = generate_prompt(
            state["context"],
            state["meeting_type"],
            state["project_topic"],
            state["question"]
        )
        response = llm.generate_content(prompt)
        state["response"] = response.text.strip()
        return state
    return RunnableLambda(_run)

# ----------- Création du graph LangGraph -----------

def build_agent_graph(llm):
    workflow = StateGraph(dict)

    workflow.add_node("fetch_context", RunnableLambda(fetch_context_node))
    workflow.add_node("generate_response", generate_response_node(llm))

    workflow.set_entry_point("fetch_context")
    workflow.add_edge("fetch_context", "generate_response")
    workflow.set_finish_point("generate_response")

    return workflow.compile()


