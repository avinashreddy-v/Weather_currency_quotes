// src/components/CurrencyConverter.jsx
import React, { useState } from "react";
import api from "../utils/api";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    setError("");
    setResult(null);
    const v = Number(amount);
    if (!amount || Number.isNaN(v) || v < 0) {
      setError("Enter a valid non-negative number");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/api/currency", { params: { amount: v } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card-header">
        <div>
          <div className="card-title">Currency Converter</div>
          <div className="helper">Convert INR to USD & EUR</div>
        </div>
      </div>

      <div className="flex gap-3 items-center mb-4">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="input-ui" placeholder="Amount in INR" />
        <button onClick={convert} className="btn-primary">Convert</button>
      </div>

      {isLoading && <p className="helper">Converting...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="mt-3 text-sm">
          <div>INR: <span className="font-medium">{result.amount_inr}</span></div>
          <div>USD: <span className="font-medium">{Number(result.usd).toFixed(4)}</span></div>
          <div>EUR: <span className="font-medium">{Number(result.eur).toFixed(4)}</span></div>
          <div className="value-small mt-2">Rates date: {result.rates_date || "—"}</div>
        </div>
      )}
    </div>
  );
}
