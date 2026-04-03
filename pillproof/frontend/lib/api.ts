import axios from "axios";
import type {
  MedicineBatch,
  BatchVerifyResult,
  BatchJourney,
  ProcurementOrder,
  SupplyChainTransfer,
  CounterfeitReport,
  DashboardStats,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Batch endpoints
export async function registerBatch(batch: MedicineBatch) {
  const res = await api.post("/batch/register", batch);
  return res.data;
}

export async function verifyBatch(batchId: string): Promise<BatchVerifyResult> {
  const res = await api.get(`/batch/verify/${batchId}`);
  return res.data;
}

export async function getBatchJourney(batchId: string): Promise<BatchJourney> {
  const res = await api.get(`/batch/journey/${batchId}`);
  return res.data;
}

// Supply chain
export async function transferBatch(transfer: SupplyChainTransfer) {
  const res = await api.post("/supply-chain/transfer", transfer);
  return res.data;
}

// Alerts
export async function raiseAlert(report: CounterfeitReport) {
  const res = await api.post("/alert/raise", report);
  return res.data;
}

// Procurement
export async function createProcurementOrder(order: ProcurementOrder) {
  const res = await api.post("/procurement/order", order);
  return res.data;
}

export async function verifyAndPay(orderId: string, isGenuine: boolean) {
  const res = await api.post(
    `/procurement/verify-and-pay/${orderId}?is_genuine=${isGenuine}`
  );
  return res.data;
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

// Blockchain status
export async function getBlockchainStatus() {
  const res = await api.get("/blockchain/status");
  return res.data;
}

export default api;
