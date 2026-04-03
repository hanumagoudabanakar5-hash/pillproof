// TypeScript interfaces for PillProof

export interface MedicineBatch {
  batch_id: string;
  medicine_name: string;
  quantity: number;
  manufacture_date: string;
  expiry_date: string;
  manufacturer_address: string;
}

export interface BatchVerifyResult {
  is_genuine: boolean;
  status: "GENUINE" | "COUNTERFEIT";
  batch_id: string;
  medicine_name?: string;
  manufacturer?: string;
  manufacture_date?: string;
  expiry_date?: string;
  current_stage?: string;
  message?: string;
  database?: string;
}

export interface JourneyTransfer {
  from: string;
  to: string;
  stage: string;
  blockchain: string;
  timestamp: string;
}

export interface BatchJourney {
  batch_id: string;
  medicine_name: string;
  current_stage: string;
  journey: JourneyTransfer[];
  total_transfers: number;
}

export interface ProcurementOrder {
  order_id: string;
  supplier_address: string;
  medicine_batch_id: string;
  payment_amount: number;
}

export interface SupplyChainTransfer {
  batch_id: string;
  from_address: string;
  to_address: string;
  stage: string;
}

export interface CounterfeitReport {
  batch_id: string;
  alert_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reported_location: string;
  reporter_address: string;
}

export interface DashboardStats {
  total_batches: number;
  genuine_batches: number;
  counterfeit_batches: number;
  total_orders: number;
  total_alerts: number;
  blockchain: string;
  database: string;
}

export interface PaymentRequest {
  sender_address: string;
  receiver_address: string;
  amount_algo: number;
  note?: string;
  batch_id?: string;
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  amount_algo?: number;
  sender?: string;
  receiver?: string;
  note?: string;
  timestamp?: string;
  error?: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  sender_address: string;
  receiver_address: string;
  amount_algo: number;
  amount_usd?: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  batch_id?: string;
  note?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
