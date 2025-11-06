// client/api/currency.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const amountRaw = (req.query.amount || req.body?.amount);
    if (!amountRaw) return res.status(400).json({ error: "Missing query parameter: amount" });

    const amount = Number(amountRaw);
    if (Number.isNaN(amount) || !isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: "Invalid amount. Provide a non-negative number." });
    }

    // Fetch rates for USD, EUR, INR (no forced base)
    const r = await axios.get('https://api.exchangerate.host/latest', {
      params: { symbols: 'USD,EUR,INR' },
      timeout: 8000
    });

    const rates = r.data && r.data.rates;
    if (!rates) return res.status(502).json({ error: "Invalid response from exchange rate provider." });

    const rateINR = rates.INR;
    const rateUSD = rates.USD;
    const rateEUR = rates.EUR;

    // If provider gives direct INR rate, compute conversions
    if (rateINR && (rateUSD || rateEUR)) {
      const usd = rateUSD !== undefined ? +(amount * (rateUSD / rateINR)).toFixed(6) : null;
      const eur = rateEUR !== undefined ? +(amount * (rateEUR / rateINR)).toFixed(6) : null;
      return res.status(200).json({ amount_inr: amount, usd, eur, rates_date: r.data.date || null, source: "exchangerate.host" });
    }

    // Fallback: try base=INR request
    const alt = await axios.get('https://api.exchangerate.host/latest', {
      params: { base: 'INR', symbols: 'USD,EUR' },
      timeout: 8000
    });
    const altRates = alt.data && alt.data.rates;
    if (altRates) {
      const usdVal = altRates.USD ? +(amount * altRates.USD).toFixed(6) : null;
      const eurVal = altRates.EUR ? +(amount * altRates.EUR).toFixed(6) : null;
      return res.status(200).json({ amount_inr: amount, usd: usdVal, eur: eurVal, rates_date: alt.data.date || null, source: "exchangerate.host (fallback)" });
    }

    return res.status(502).json({ error: "Could not obtain necessary exchange rates." });
  } catch (err) {
    console.error("Currency function error:", err?.response?.data || err?.message || err);
    return res.status(500).json({ error: "Could not fetch currency data." });
  }
}
