import google.generativeai as genai
from embeddings import embed_text_list
from vectorstore import query_db,get_num_chunks
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"

def generate_answer(query: str, doc_id: str) -> dict:
    """
    Full RAG pipeline with AUTOMATIC top_k selection.
    """

    # 1. Embed query
    query_embedding = embed_text_list([query])[0]

    num_chunks = get_num_chunks(doc_id)

    if num_chunks <= 20:
        top_k = 3
    elif num_chunks <= 60:
        top_k = 6
    elif num_chunks <= 120:
        top_k = 10
    else:
        top_k = 12

    # 2. Retrieve relevant chunks
    results = query_db(query_embedding,doc_id=doc_id, top_k=top_k)
    retrieved_chunks = results.get("documents", [[]])[0]

     # If retrieval fails (no chunks)
    if not retrieved_chunks:
        return {
            "answer": "No relevant information found. The document may not be indexed correctly.",
            "retrieved_chunks": []
        }


    # Build context string
    context = "\n\n".join(retrieved_chunks)

    # 3. Build improved prompt
    prompt = f"""
You are a helpful assistant. Use the following document text to answer the user's question.

Document Content:
{context}

User Question:
{query}

Instructions:
- If the document directly or indirectly contains the answer, extract it clearly.
- Be concise and accurate.
- If the document truly does NOT contain the answer, say:
  "The document does not contain information related to your question."

Now provide the best possible answer:
"""

    # 4. Ask Gemini
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    answer = response.text

    return {
        "answer": answer,
        "retrieved_chunks": retrieved_chunks
    }
