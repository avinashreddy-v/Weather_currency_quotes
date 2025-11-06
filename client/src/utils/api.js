// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  timeout: 9000,
});

export default api;
