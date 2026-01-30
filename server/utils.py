import os
from supabase_client import supabase

# def save_uploaded_file(upload_file, upload_dir="uploads"):
#     upload_dir = Path(upload_dir)
#     upload_dir.mkdir(parents=True, exist_ok=True)

#     file_path = upload_dir / upload_file.filename

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(upload_file.file, buffer)

#     return str(file_path)

def upload_to_supabase(file):
    bucket = os.getenv("SUPABASE_BUCKET")
    file_bytes = file.file.read()
    path = file.filename

    storage = supabase.storage.from_(bucket)

    # Try normal upload first
    try:
        storage.upload(path, file_bytes)
    except Exception as e:
        # If file exists, update() overwrites it
        if "already exists" in str(e) or "Duplicate" in str(e):
            storage.update(path, file_bytes)
        else:
            raise e

    # Generate public URL
    public_url = storage.get_public_url(path)
    return public_url

