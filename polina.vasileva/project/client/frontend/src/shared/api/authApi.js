import axios from "axios";

const API_URL = "http://localhost:8080";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
};

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const loginRequest = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  if (response.data.sessionId) {
    localStorage.setItem("sessionId", response.data.sessionId);
  }
  return response.data;
};

export const logoutRequest = async () => {
  await axios.post(`${API_URL}/logout`, {}, { headers: getAuthHeader() });
  localStorage.removeItem("sessionId");
};

// ─── Goods ────────────────────────────────────────────────────────────────────
export const getGoods = async () => {
  const response = await axios.get(`${API_URL}/goods`);
  return response.data;
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData, {
    headers: getAuthHeader(),
  });
  return response.data;
};