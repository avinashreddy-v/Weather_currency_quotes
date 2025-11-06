// client/api/weather.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const city = (req.query.city || req.body?.city || "London").toString();
    const key = process.env.OPENWEATHER_API_KEY;

    if (!key) {
      // Fallback mock when no key
      const tempC = 20 + Math.floor(Math.random() * 10);
      return res.status(200).json({
        city,
        temperature_c: tempC,
        temperature_f: +(tempC * 9/5 + 32).toFixed(1),
        condition: "Partly cloudy (mock)",
        icon: "01d",
        source: "mock"
      });
    }

    const r = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { q: city, appid: key, units: "metric" },
      timeout: 8000,
    });

    const d = r.data;
    if (!d || !d.main || !d.weather) {
      return res.status(502).json({ error: "Invalid response from weather provider." });
    }

    return res.status(200).json({
      city: d.name,
      temperature_c: d.main.temp,
      temperature_f: +(d.main.temp * 9/5 + 32).toFixed(1),
      condition: d.weather[0]?.description || "",
      icon: d.weather[0]?.icon || "",
      source: "openweathermap"
    });
  } catch (err) {
    console.error("Weather function error:", err?.response?.data || err?.message || err);
    if (err?.response?.status === 404) return res.status(404).json({ error: "City not found." });
    return res.status(500).json({ error: "Could not fetch weather data." });
  }
}
