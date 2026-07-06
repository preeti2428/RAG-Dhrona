import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Initialize global variables for models and vector store
embeddings = None
vector_store = None
llm = None
rag_chain = None

DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def init_rag_system():
    global embeddings, vector_store, llm, rag_chain
    
    print("Initializing embedding model...")
    # Use sentence-transformers (local, free)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Initializing ChromaDB vector store...")
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    print("Initializing LLM...")
    # Using Gemini via langchain-google-genai
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.7)
    
    print("Setting up RAG chain...")
    system_prompt = (
        "You are an intelligent assistant. Use the following pieces of retrieved context to answer the user's question.\n"
        "If you don't know the answer based on the context, just say that you don't know. Do not make up an answer.\n\n"
        "Context:\n{context}"
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    # Retrieve top 4 chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    print("RAG system initialized successfully.")

def get_answer(question: str) -> str:
    if not rag_chain:
        raise ValueError("RAG chain not initialized. Please call init_rag_system() first.")
    
    response = rag_chain.invoke({"input": question})
    return response.get("answer", "No answer generated.")
