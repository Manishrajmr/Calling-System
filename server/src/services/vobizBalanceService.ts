import axios from "axios";

// ------------------ Types ------------------

// Balance types
export type VobizBalance = {
  balance: number;
  available_balance: number;
  low_balance_threshold: number;
};

// Transaction types
export type VobizTransaction = {
  id: string;
  type: "debit" | "credit";
  amount: number;
  currency: string;
  created_at: string; // ISO date string
  reference_type: string;
};
export type TransactionReferenceSummary = {
  reference_type: string;
  total_debit: number;
  total_credit: number;
  count: number;
};

export interface VobizTransactionsResponse {
  transactions: VobizTransaction[];
  summary: {
    total_transactions: number;
    total_debit: number;
    total_credit: number;
    net_amount: number;
    by_reference_type: TransactionReferenceSummary[];
  };
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Metrics return type
export interface Metrics {
  balance: number;
  todaySpend: number;
  burnRate: number;
  timeLeft: number; // in hours
  status: "SAFE" | "LOW" | "CRITICAL";
}

// ------------------ Headers ------------------
const headers = {
  "X-Auth-ID": process.env.VOBIZ_AUTH_ID!,
  "X-Auth-Token": process.env.VOBIZ_AUTH_TOKEN!,
  "Content-Type": "application/json",
};

// ------------------ VOBIZ API Calls ------------------

export async function getBalance(): Promise<VobizBalance> {
  const res = await axios.get<VobizBalance>(
    `${process.env.VOBIZ_BASE_URL}/account/${process.env.VOBIZ_AUTH_ID}/balance/INR`,
    { headers }
  );
  return res.data;
}

export async function getAllTransactions(): Promise<VobizTransaction[]> {
  let allTransactions: VobizTransaction[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await axios.get<VobizTransactionsResponse>(
        `${process.env.VOBIZ_BASE_URL}/account/${process.env.VOBIZ_AUTH_ID}/transactions?page=${page}`,
        { headers }
      );

      const data = response.data;
      allTransactions = allTransactions.concat(data.transactions);

      // Agar API response me total pages ya next_page diya ho
      totalPages = data.total_pages || 1;
      page++;
    } while (page <= totalPages);

    return allTransactions;
  } catch (error) {
    console.error("Error fetching all Vobiz transactions:", error);
    throw error;
  }
}

// ------------------ Metrics Calculation ------------------

export function calculateMetrics(
  balanceData: VobizBalance,
  transactions: VobizTransaction[]
): Metrics {
  const today = new Date().toISOString().split("T")[0] as string;

  const todayTxns = transactions.filter(
    (t) => t.type === "debit" && t.created_at.startsWith(today)
  );

  const todaySpend = todayTxns.reduce((sum, t) => sum + t.amount, 0);

  const hoursPassed = new Date().getHours() || 1;
  const burnRate = todaySpend / hoursPassed;

  const balance = balanceData.balance;
  const timeLeft = burnRate > 0 ? balance / burnRate : 999;

  let status: Metrics["status"] = "SAFE";
  if (balance < balanceData.low_balance_threshold) status = "LOW";
  if (timeLeft < 2) status = "CRITICAL";

  return { balance, todaySpend, burnRate, timeLeft, status };
}