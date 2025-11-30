import { useState, useEffect } from "react";
import { getTransactionsByNote, createTransaction } from "../services/api/chainApi";

export default function useChainTransactions(noteId) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    if (!noteId) return;
    
    setLoading(true);
    try {
      const data = await getTransactionsByNote(noteId);
      setTransactions(data.transactions || []);
      setError("");
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [noteId]);

  const addTransaction = async (txData) => {
    try {
      const result = await createTransaction(txData);
      setTransactions((prev) => [...prev, result]);
      setError("");
      return result;
    } catch (err) {
      console.error("Failed to create transaction:", err);
      setError("Failed to create transaction.");
      throw err;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    setError,
    addTransaction,
    reloadTransactions: loadTransactions,
  };
}