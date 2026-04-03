from pyteal import *

def batch_verification_contract():
    """
    Smart contract for medicine batch verification on Algorand
    """
    
    # State variables
    batch_id = Bytes("batch_id")
    medicine_name = Bytes("medicine_name")
    manufacturer = Bytes("manufacturer")
    quantity = Bytes("quantity")
    expiry_date = Bytes("expiry_date")
    is_verified = Bytes("is_verified")
    verification_timestamp = Bytes("verification_timestamp")
    
    # OnComplete actions
    on_create = Seq([
        Assert(Txn.application_args.length() == Int(5)),
        App.globalPut(batch_id, Txn.application_args[0]),
        App.globalPut(medicine_name, Txn.application_args[1]),
        App.globalPut(manufacturer, Txn.application_args[2]),
        App.globalPut(quantity, Txn.application_args[3]),
        App.globalPut(expiry_date, Txn.application_args[4]),
        App.globalPut(is_verified, Bytes("no")),
        Approve(),
    ])
    
    # Verify batch
    on_verify = Seq([
        App.globalPut(is_verified, Bytes("yes")),
        App.globalPut(verification_timestamp, Txn.application_args[0]),
        Approve(),
    ])
    
    # Main logic
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.NoOp, on_verify],
    )
    
    return program

if __name__ == "__main__":
    program = batch_verification_contract()
    print(compileTeal(program, mode=Mode.Application, version=10))
