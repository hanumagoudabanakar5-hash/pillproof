from beaker import *
from pyteal import *

class CounterfeitAlertState:
    batch_id = GlobalStateValue(stack_type=TealType.bytes, descr="Flagged batch ID")
    alert_status = GlobalStateValue(stack_type=TealType.bytes, descr="ACTIVE INVESTIGATING RESOLVED")

app = Application("CounterfeitAlert", state=CounterfeitAlertState())

@app.create
def create():
    return app.initialize_global_state()

@app.external
def raise_alert(batch_id: abi.String):
    return Seq([
        app.state.batch_id.set(batch_id.get()),
        app.state.alert_status.set(Bytes("ACTIVE")),
    ])
