def chunk_text(text: str, chunk_size: int = 800, overlap: int = 200) -> list:
    """
    Splits text into chunks with overlap.

    chunk_size: max characters per chunk
    overlap: repeated characters between chunks (for continuity)
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end - overlap  # slide window back by overlap

        if start < 0:
            start = 0

    return chunks
