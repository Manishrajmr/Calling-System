import { useEffect, useState } from "react";
import axios from "axios";

// Import all types from your types file

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

// Metrics return type
export interface Metrics {
  balance: number;
  todaySpend: number;
  burnRate: number;
  timeLeft: number; // in hours
  status: "SAFE" | "LOW" | "CRITICAL";
}

type VobizOverviewResponse = {
  balanceData: {
    balance: number;
    available_balance: number;
    low_balance_threshold: number;
  };
  metrics: {
    balance: number;
    todaySpend: number;
    burnRate: number;
    timeLeft: number;
    status: "SAFE" | "LOW" | "CRITICAL";
  };
};

export default function VobizOverview() {
  const [overview, setOverview] = useState<VobizOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await axios.get<VobizOverviewResponse>("http://localhost:5000/api/vobiz/overview");
        setOverview(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Vobiz data");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const { balanceData, metrics } = overview!;

  const statusColor = {
    SAFE: "bg-green-100 text-green-800",
    LOW: "bg-yellow-100 text-yellow-800",
    CRITICAL: "bg-red-100 text-red-800",
  } as const;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Vobiz Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Balance</h2>
          <p className="text-3xl font-bold">₹{balanceData.balance.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Available Balance: ₹{balanceData.available_balance.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Low Balance Threshold: ₹{balanceData.low_balance_threshold.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Today's Spend</h2>
          <p className="text-3xl font-bold">₹{metrics.todaySpend.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Burn Rate: ₹{metrics.burnRate.toFixed(2)} / hr</p>
          <p className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold ${statusColor[metrics.status]}`}>
            {metrics.status}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Estimated Time Left</h2>
          <p className="text-3xl font-bold">{metrics.timeLeft.toFixed(2)} hr</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Info</h2>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}