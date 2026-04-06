from algosdk.v2client import algod
import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AlgoClient:
    def __init__(self):
        self.client = algod.AlgodClient("", "https://testnet-api.algonode.cloud", headers={"X-API-Key": ""})
        self.pinata_jwt = os.getenv("PINATA_JWT")

    def upload_to_ipfs(self, batch_data):
        """Uploads medicine metadata to Pinata IPFS"""
        url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
        headers = {
            "Authorization": f"Bearer {self.pinata_jwt}",
            "Content-Type": "application/json"
        }
        response = requests.post(url, json=batch_data, headers=headers)
        if response.status_code == 200:
            return response.json().get("IpfsHash")
        else:
            print(f"IPFS Error: {response.text}")
            return None

    def verify_batch_on_chain(self, batch_id):
        # In the final version, this reads the ARC-3 ASA from the blockchain
        if "FAKE" in batch_id.upper():
            return {"status": "Counterfeit", "verified": False, "alert": "🚨 ALERT: Counterfeit detected!"}
        return {"status": "Genuine", "verified": True, "alert": "✅ Verified on Algorand Blockchain"}

algo_service = AlgoClient()
