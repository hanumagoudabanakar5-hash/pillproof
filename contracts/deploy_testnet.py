import os
import json
import base64
from algosdk.v2client import algod
from algosdk import transaction, mnemonic, account

# --- CONFIGURATION ---
# Replace this with your actual mnemonic if you have one, 
# otherwise the script will generate a new one and tell you to fund it.
MNEMONIC = os.getenv("DEPLOYER_MNEMONIC", "") 

algod_client = algod.AlgodClient("", "https://testnet-api.algonode.cloud", headers={"X-API-Key": ""})

if not MNEMONIC:
    pk, addr = account.generate_account()
    MNEMONIC = mnemonic.from_private_key(pk)
    print(f"\n🛑 NEW WALLET GENERATED!")
    print(f"ADDRESS: {addr}")
    print(f"MNEMONIC: {MNEMONIC}")
    print(f"\n1. Go to https://bank.testnet.algorand.network/")
    print(f"2. Paste your address and DISPENSE ALGOs.")
    input("\nPRESS ENTER AFTER YOU HAVE FUNDED THE WALLET...")

private_key = mnemonic.to_private_key(MNEMONIC)
sender = account.address_from_private_key(private_key)

print(f"\n🚀 Deploying contracts for {sender[:8]}...\n")

# This is a simplified deployer for the hackathon
for name in ["MediRegistry", "ProcurementEscrow", "CounterfeitAlert"]:
    try:
        # We assume artifacts are generated via 'algokit compile'
        with open(f"artifacts/{name}.arc56.json", "r") as f:
            d = json.load(f)
        
        app_teal = base64.b64decode(d["source"]["approval"]).decode("utf-8")
        clear_teal = base64.b64decode(d["source"]["clear"]).decode("utf-8")
        
        app_bytes = base64.b64decode(algod_client.compile(app_teal)["result"])
        clear_bytes = base64.b64decode(algod_client.compile(clear_teal)["result"])
        
        sp = algod_client.suggested_params()
        txn = transaction.ApplicationCreateTxn(
            sender=sender, sp=sp, on_complete=transaction.OnComplete.NoOpOC,
            approval_program=app_bytes, clear_program=clear_bytes,
            global_schema=transaction.StateSchema(0,0), local_schema=transaction.StateSchema(0,0)
        )
        
        signed_txn = txn.sign(private_key)
        txid = algod_client.send_transaction(signed_txn)
        print(f"✅ {name} Deployed! TXID: {txid}")
        print(f"🔎 Link: https://lora.algokit.io/testnet/transaction/{txid}\n")
    except Exception as e:
        print(f"❌ {name} failed: {e}. (Did you run 'algokit compile' first?)")
