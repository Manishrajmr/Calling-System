import { getBalance,getAllTransactions } from "../services/vobizBalanceService.js";
import { calculateMetrics } from "../services/vobizBalanceService.js";
import { Request, Response } from "express";

/**
 * Fetches Vobiz account data and metrics
 */
export async function fetchVobizOverview(req: Request, res: Response) {
  try {
    // Get latest balance from Vobiz
    const balanceData = await getBalance();

    // Get recent transactions (page 1)
    const transactionsData = await getAllTransactions();

    // Calculate metrics
    const vobizMetrics = calculateMetrics(balanceData, transactionsData);

    res.json({
      balanceData,
      metrics: vobizMetrics,
    });
  } catch (err) {
    console.error("Error fetching Vobiz overview:", err);
    res.status(500).json({ error: "Failed to fetch Vobiz overview" });
  }
}