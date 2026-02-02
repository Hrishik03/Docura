from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

from utils import upload_to_supabase
from extractor import extract_text
from chunker import chunk_text
from embeddings import embed_text_list
from vectorstore import add_to_db
from rag import generate_answer
from supabase_client import supabase

app = FastAPI()

print("FastAPI app starting...")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Form(None),  # 👈 real auth.users.id
):
    doc_id = str(uuid.uuid4())
    file_name = file.filename

    file_url = upload_to_supabase(file)

    text = extract_text(file_url)
    chunks = chunk_text(text)
    embeddings = embed_text_list(chunks)

    add_to_db(chunks, embeddings, doc_id, file_url)

    if user_id and user_id != "string" and len(user_id) == 36:
        try:
            # Validate it's a proper UUID format
            uuid.UUID(user_id)  # This will raise ValueError if invalid
            supabase.table("documents").insert({
                "user_id": user_id,
                "doc_id": doc_id,
                "file_name": file_name,
                "file_url": file_url
            }).execute()
        except (ValueError, Exception):
            # Skip insert if user_id is invalid
            pass

    return {
        "doc_id": doc_id,
        "file_name": file_name,
        "file_url": file_url,
        "num_chunks": len(chunks),
        "status": "Document uploaded successfully"
    }

class QueryRequest(BaseModel):
    query: str
    doc_id: str

@app.post("/query")
async def query_rag(request: QueryRequest):
    result = generate_answer(query=request.query, doc_id=request.doc_id)
    return result

@app.get("/")
def root():
    return {"message": "RAG backend running successfully!"}
