import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def embed_text_list(text_list: list) -> list:
    """
    Embeds a list of text chunks using Gemini's text-embedding-004 model.
    Works correctly for google-generativeai version 0.8.5.
    """

    model = "models/text-embedding-004"
    embeddings = []

    for text in text_list:
        response = genai.embed_content(
            model=model,
            content=text
        )
        embeddings.append(response["embedding"])

    return embeddings
