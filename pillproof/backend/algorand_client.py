from algosdk.v2client import algod
from algosdk import account, mnemonic
import os

# Algorand Testnet Configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

def get_algod_client():
    """Create and return an Algorand client instance"""
    try:
        client = algod.AlgodClient(
            ALGOD_TOKEN,
            ALGOD_ADDRESS
        )
        return client
    except Exception as e:
        print(f"❌ Error connecting to Algorand: {str(e)}")
        return None

def get_account_info(address: str):
    """Get account information from Algorand blockchain"""
    try:
        client = get_algod_client()
        if not client:
            return {"error": "Failed to connect to blockchain"}
        account_info = client.account_info(address)
        return account_info
    except Exception as e:
        return {"error": str(e)}

def check_balance(address: str):
    """Check account balance on Algorand"""
    try:
        client = get_algod_client()
        if not client:
            return {"error": "Failed to connect to blockchain"}
        account_info = client.account_info(address)
        balance = account_info.get("amount")
        return {"address": address, "balance": balance}
    except Exception as e:
        return {"error": str(e)}

def get_transaction_info(txid: str):
    """Get transaction information from Algorand"""
    try:
        client = get_algod_client()
        if not client:
            return {"error": "Failed to connect to blockchain"}
        transaction = client.pending_transaction_info(txid)
        return transaction
    except Exception as e:
        return {"error": str(e)}

def verify_blockchain_connection():
    """Verify connection to Algorand blockchain"""
    try:
        client = get_algod_client()
        if not client:
            return {"status": "DISCONNECTED", "message": "Failed to connect"}
        status = client.status()
        return {
            "status": "CONNECTED",
            "message": "Successfully connected to Algorand Testnet",
            "last_round": status.get("last-round")
        }
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}