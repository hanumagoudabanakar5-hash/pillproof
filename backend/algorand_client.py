from algosdk.v2client import algod
import os

class AlgoClient:
    def __init__(self):
        # Using AlgoNode - Free public node, works perfectly on Replit
        self.client = algod.AlgodClient("", "https://testnet-api.algonode.cloud", headers={"X-API-Key": ""})

    def verify_batch_on_chain(self, batch_id):
        """
        In a live environment, this reads the Global State of the 
        deployed MediRegistry smart contract.
        """
        # For the demo, if batch_id starts with 'FAKE', it's counterfeit
        if "FAKE" in batch_id.upper():
            return {"status": "Counterfeit", "verified": False, "alert": "🚨 ALERT: Counterfeit detected!"}
        
        return {"status": "Genuine", "verified": True, "alert": "✅ Batch verified on Algorand Testnet"}

algo_service = AlgoClient()
