// src/components/WeatherModule.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function WeatherModule() {
  const [city, setCity] = useState("London");
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName = city) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/weather", { params: { city: cityName } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch weather");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []);

  const tempC = data?.temperature_c;
  const tempF = data?.temperature_f;
  const condition = data?.condition || "unknown";
  const displayCity = data?.city || city;

  return (
    <div>
      <div className="card-header">
        <div>
          <div className="card-title">Weather</div>
          <div className="helper">Current conditions</div>
        </div>
        <div className="helper text-xs">{displayCity}</div>
      </div>

      <div className="flex gap-3 items-center mb-4">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="input-ui"
        />
        <button onClick={() => fetchWeather(city)} className="btn-primary">Search</button>
      </div>

      {isLoading && <p className="helper">Loading weather...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!isLoading && !error && (
        <div className="mt-3">
          <div className="flex items-center gap-4">
            <div>
              <div className="value-big">{tempC !== undefined ? `${Math.round(tempC)}°C` : "—"}</div>
              <div className="value-small">{tempF !== undefined ? `${tempF}°F` : ""}</div>
            </div>

            <div>
              <div className="capitalize helper">{condition}</div>
              <div className="value-small mt-1">{data?.source || "source: unknown"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
