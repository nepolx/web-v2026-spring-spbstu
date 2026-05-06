import api from "./axiosConfig";

export const loginRequest = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post("/logout");
 
  localStorage.removeItem("sessionId");
  localStorage.removeItem("user");
  return response.data;
};


export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};


export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getGoods = async () => {
  const response = await api.get("/goods");
  return response.data;
};