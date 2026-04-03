import json
import sys
from algosdk.v2client import algod
from batch_contract import batch_verification_contract
from pyteal import compileTeal, Mode

# Algorand client
algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""
client = algod.AlgodClient(algod_token, algod_address)

def deploy_contract():
    """Deploy batch verification contract to Algorand testnet"""
    
    try:
        # Get network status
        status = client.status()
        print(f"✅ Connected to Algorand!")
        print(f"Latest confirmed block: {status['last-round']}")
        
        # Compile contract
        program = batch_verification_contract()
        teal_code = compileTeal(program, Mode.Application, version=10)
        print(f"✅ Contract compiled successfully!")
        print(f"Contract size: {len(teal_code)} bytes")
        
        return {
            "success": True,
            "message": "Contract ready for deployment",
            "contract_size": len(teal_code),
            "network_status": "Connected"
        }
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "message": "Using mock mode for development"
        }

if __name__ == "__main__":
    result = deploy_contract()
    print(json.dumps(result, indent=2))
