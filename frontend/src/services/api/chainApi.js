import axios from "axios";
import { API_ENDPOINTS } from "../config.js";

const chainAPI = axios.create({
  baseURL: API_ENDPOINTS.chain,
});

// Create a new blockchain transaction
export const createTransaction = async (txData) => {
  const res = await chainAPI.post("/tx", txData);
  return res.data;
};

// Get all transactions for a specific note
export const getTransactionsByNote = async (noteId) => {
  const res = await chainAPI.get("/txs", { params: { noteId } });
  return res.data;
};