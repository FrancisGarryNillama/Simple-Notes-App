import { useState, useEffect } from "react";
import { 
  getFolders, 
  createFolder, 
  deleteFolder 
} from "../services/api/foldersApi";

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await getFolders();
      setFolders(data);
      setError("");
    } catch (err) {
      console.error("Failed to load folders:", err);
      setError("Failed to load folders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (name) => {
    try {
      const folder = await createFolder({ name });
      setFolders((prev) => [...prev, folder]);
      setError("");
    } catch (err) {
      console.error("Failed to create folder:", err);
      setError("Failed to create folder. Please try again.");
      throw err;
    }
  };

  const removeFolder = async (id) => {
    try {
      await deleteFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      setError("");
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setError("Failed to delete folder. Please try again.");
      throw err;
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return {
    folders,
    loading,
    error,
    setError,
    addFolder,
    removeFolder,
    reloadFolders: loadFolders,
  };
}