// src/components/QuoteGenerator.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuote = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/quote");
      setQuote(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div>
      <div className="card-header">
        <div>
          <div className="card-title">Motivational Quote</div>
          <div className="helper">A little push for your day</div>
        </div>
      </div>

      {isLoading && <p className="helper">Loading quote...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {quote && (
        <>
          <blockquote className="quote-text">“{quote.quote}”</blockquote>
          <div className="value-small mt-2">— {quote.author || "Unknown"}</div>
        </>
      )}

      <div className="mt-4">
        <button onClick={fetchQuote} className="btn-primary">New Quote</button>
      </div>
    </div>
  );
}
