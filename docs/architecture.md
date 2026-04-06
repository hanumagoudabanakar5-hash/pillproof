# Technical Architecture

## Workflow
1. **Registration:** Manufacturer registers batch -> Backend triggers Algorand Contract -> ASA minted.
2. **Procurement:** Government Agent orders batch -> Funds locked in Escrow Contract.
3. **Verification:** Pharmacist scans QR -> Backend verifies hash on Algorand -> If Genuine, Escrow releases funds.
4. **Alert:** If Hash mismatch -> CounterfeitAlert contract freezes the ASA -> CDSCO notified.
