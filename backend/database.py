import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DBManager:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise Exception("Missing Supabase credentials in .env file!")
        self.supabase: Client = create_client(url, key)

    def save_batch(self, batch_id, name, qty, manufacturer, ipfs_hash):
        data = {
            "batch_id": batch_id,
            "medicine_name": name,
            "quantity": qty,
            "manufacturer": manufacturer,
            "ipfs_hash": ipfs_hash
        }
        return self.supabase.table("medicine_batches").insert(data).execute()

    def get_batch(self, batch_id):
        return self.supabase.table("medicine_batches").select("*").eq("batch_id", batch_id).single().execute()

db = DBManager()
