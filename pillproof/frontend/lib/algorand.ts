// Algorand integration utilities for PillProof
// Uses Algorand Testnet for payment processing

export const ALGO_USD_RATE = 0.18; // approximate rate; replaced by live fetch
export const ALGO_INR_RATE = 15.0; // approximate rate

export interface AlgoPaymentParams {
  senderAddress: string;
  receiverAddress: string;
  amountAlgo: number;
  note?: string;
}

export interface AlgoPaymentResult {
  success: boolean;
  transactionId?: string;
  confirmedRound?: number;
  error?: string;
}

/**
 * Convert USD to ALGO
 */
export function usdToAlgo(usd: number, rate: number = ALGO_USD_RATE): number {
  if (rate <= 0) return 0;
  return parseFloat((usd / rate).toFixed(6));
}

/**
 * Convert INR to ALGO
 */
export function inrToAlgo(inr: number, rate: number = ALGO_INR_RATE): number {
  if (rate <= 0) return 0;
  return parseFloat((inr / rate).toFixed(6));
}

/**
 * Convert ALGO to USD
 */
export function algoToUsd(algo: number, rate: number = ALGO_USD_RATE): number {
  return parseFloat((algo * rate).toFixed(2));
}

/**
 * Convert ALGO to INR
 */
export function algoToInr(algo: number, rate: number = ALGO_INR_RATE): number {
  return parseFloat((algo * rate).toFixed(2));
}

/**
 * Validate an Algorand address (basic check: 58 chars, uppercase alphanumeric)
 */
export function isValidAlgorandAddress(address: string): boolean {
  return /^[A-Z2-7]{58}$/.test(address);
}

/**
 * Fetch live ALGO/USD price from a public API
 * Falls back to default rate on error
 */
export async function fetchAlgoPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd"
    );
    if (!res.ok) return ALGO_USD_RATE;
    const data = await res.json();
    return data?.algorand?.usd ?? ALGO_USD_RATE;
  } catch {
    return ALGO_USD_RATE;
  }
}

/**
 * Format microalgos (the on-chain unit) to ALGO
 */
export function microAlgosToAlgo(microAlgos: number): number {
  return microAlgos / 1_000_000;
}

/**
 * Format ALGO to microalgos
 */
export function algoToMicroAlgos(algo: number): number {
  return Math.round(algo * 1_000_000);
}

/**
 * Generate a mock transaction ID for demo purposes
 * In production this comes from the Algorand SDK
 */
export function generateMockTxId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  for (let i = 0; i < 52; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
