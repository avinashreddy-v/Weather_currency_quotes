// client/api/quote.js
import { json } from '@vercel/node';

const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

export default function handler(req, res) {
  try {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return res.status(200).json(q);
  } catch (err) {
    console.error("Quote function error:", err);
    return res.status(500).json({ error: "Could not fetch quote." });
  }
}
