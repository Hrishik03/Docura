import chromadb

# NEW client format
chroma_client = chromadb.PersistentClient(path="chroma_db")

collection = chroma_client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}  
)

def add_to_db(chunks, embeddings, doc_id, file_url):
    """
    Stores chunks + embeddings in vector DB.
    Includes metadata for doc tracking.
    """
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]

    metadata_list = [
        {"doc_id": doc_id, "file_url": file_url}
        for _ in chunks
    ]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadata_list
    )



def query_db(query_embedding, doc_id, top_k=3):
    """
    Query only chunks belonging to this doc_id.
    """
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"doc_id": doc_id}
    )
    return results

def get_num_chunks(doc_id):
    """
    Return how many chinks belong to this doc
    used to calculate dynamic top_k

    """

    results = collection.get(where={"doc_id": doc_id})
    return len(results["ids"]) if results and "ids" in results else 0
