// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/* Mock quotes */
const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

app.get('/api/quote', (req, res) => {
  try {
    const q = getRandomQuote();
    return res.json(q);
  } catch (err) {
    console.error('Quote error:', err?.message || err);
    return res.status(500).json({ error: 'Could not fetch quote.' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const city = (req.query.city || 'London').trim();
    const key = process.env.OPENWEATHER_API_KEY;

    if (!key) {
      const tempC = 20 + Math.floor(Math.random() * 10);
      return res.json({
        city,
        temperature_c: tempC,
        temperature_f: +(tempC * 9/5 + 32).toFixed(1),
        condition: "Partly cloudy (mock)",
        icon: "01d",
        source: "mock"
      });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: key, units: 'metric' },
      timeout: 7000
    });

    const d = response.data;
    if (!d || !d.main || !d.weather) {
      return res.status(502).json({ error: 'Invalid response from weather provider.' });
    }

    return res.json({
      city: d.name,
      temperature_c: d.main.temp,
      temperature_f: +(d.main.temp * 9/5 + 32).toFixed(1),
      condition: d.weather[0]?.description || '',
      icon: d.weather[0]?.icon || '',
      source: "openweathermap"
    });
  } catch (err) {
    console.error('Weather error:', err?.response?.data || err?.message || err);
    if (err?.response?.status === 404) {
      return res.status(404).json({ error: 'City not found.' });
    }
    return res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});

/**
 * Robust currency endpoint
 * Strategy:
 * 1. Request latest rates for USD, EUR, INR in one call (no forced base).
 * 2. If rates.INR, rates.USD, rates.EUR exist, compute:
 *      usd = amount * (rates.USD / rates.INR)
 *      eur = amount * (rates.EUR / rates.INR)
 * 3. Return nicely formatted JSON.
 */
app.get('/api/currency', async (req, res) => {
  try {
    const amountRaw = req.query.amount;
    if (!amountRaw) {
      return res.status(400).json({ error: 'Missing query parameter: amount' });
    }

    const amount = Number(amountRaw);
    if (Number.isNaN(amount) || !isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount. Provide a non-negative number.' });
    }

    // Fetch USD, EUR, INR rates in single request (no forced base)
    const r = await axios.get('https://api.exchangerate.host/latest', {
      params: { symbols: 'USD,EUR,INR' },
      timeout: 7000
    });

    const rates = r.data && r.data.rates;
    if (!rates) {
      return res.status(502).json({ error: 'Invalid response from exchange rate provider.' });
    }

    const rateINR = rates.INR;
    const rateUSD = rates.USD;
    const rateEUR = rates.EUR;

    if (!rateINR || (!rateUSD && !rateEUR)) {
      // Defensive fallback: try a base=INR request (older providers)
      const alt = await axios.get('https://api.exchangerate.host/latest', {
        params: { base: 'INR', symbols: 'USD,EUR' },
        timeout: 7000
      });
      const altRates = alt.data && alt.data.rates;
      if (altRates && (altRates.USD || altRates.EUR)) {
        const usdVal = altRates.USD ? +(amount * altRates.USD).toFixed(6) : null;
        const eurVal = altRates.EUR ? +(amount * altRates.EUR).toFixed(6) : null;
        return res.json({
          amount_inr: amount,
          usd: usdVal,
          eur: eurVal,
          rates_date: alt.data.date || null,
          source: "exchangerate.host (fallback)"
        });
      }
      return res.status(502).json({ error: 'Could not obtain necessary exchange rates.' });
    }

    const usd = rateUSD !== undefined ? +(amount * (rateUSD / rateINR)).toFixed(6) : null;
    const eur = rateEUR !== undefined ? +(amount * (rateEUR / rateINR)).toFixed(6) : null;

    return res.json({
      amount_inr: amount,
      usd,
      eur,
      rates_date: r.data.date || null,
      source: "exchangerate.host"
    });
  } catch (err) {
    console.error('Currency error:', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'Could not fetch currency data.' });
  }
});

/** Health */
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/** Start */
app.listen(PORT, () => {
  console.log(`InfoHub server listening on port ${PORT}`);
});
