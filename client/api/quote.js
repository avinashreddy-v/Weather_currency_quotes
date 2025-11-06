// client/api/quote.js
// Client-side helper: export quotes and a small helper to get a random quote.
// This file is bundled by Vite for the browser, so it must not import server-only packages.

const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export default QUOTES;
