from algosdk.v2client import algod, indexer
import os
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
INDEXER_ADDRESS = "https://testnet-idx.algonode.cloud"
INDEXER_TOKEN = ""

def get_algod_client():
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

def get_indexer_client():
    return indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS)

def check_connection():
    try:
        client = get_algod_client()
        status = client.status()
        return {"connected": True, "network": "Algorand Testnet", "round": status["last-round"]}
    except Exception as e:
        return {"connected": False, "error": str(e)}

def get_account_balance(address: str):
    try:
        client = get_algod_client()
        info = client.account_info(address)
        return {"address": address, "balance": info.get("amount", 0)}
    except Exception as e:
        return {"error": str(e)}