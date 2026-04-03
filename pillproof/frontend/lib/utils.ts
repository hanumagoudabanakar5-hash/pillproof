// General helper utilities for PillProof

/**
 * Format a date string (YYYY-MM-DD) for display
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format an ISO timestamp for display
 */
export function formatTimestamp(ts: string): string {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

/**
 * Truncate a long address for display  e.g. "ABCD...WXYZ"
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "—";
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Generate a simple unique ID (not cryptographically secure)
 */
export function generateId(prefix = ""): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix ? `${prefix}-${ts}-${rand}` : `${ts}-${rand}`;
}

/**
 * Capitalise the first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Map a supply-chain stage string to a human-readable label
 */
export function stageLabel(stage: string): string {
  const map: Record<string, string> = {
    MANUFACTURED: "Manufactured",
    DISTRIBUTOR: "At Distributor",
    RETAILER: "At Retailer",
    SOLD: "Sold",
    FLAGGED: "Flagged (Counterfeit)",
  };
  return map[stage] ?? titleCase(stage.replace(/_/g, " "));
}

/**
 * Return a Tailwind colour class based on batch status
 */
export function statusColor(status: string): string {
  switch (status) {
    case "GENUINE":
      return "text-green-600 dark:text-green-400";
    case "COUNTERFEIT":
    case "FLAGGED":
      return "text-red-600 dark:text-red-400";
    case "PENDING":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-zinc-600 dark:text-zinc-400";
  }
}

/**
 * Return a Tailwind badge class based on alert level
 */
export function alertLevelBadge(level: string): string {
  switch (level) {
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "HIGH":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "LOW":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
  }
}
