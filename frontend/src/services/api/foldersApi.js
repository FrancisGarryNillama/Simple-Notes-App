import axios from "axios";
import { API_ENDPOINTS } from "../config.js";

const folderAPI = axios.create({
  baseURL: API_ENDPOINTS.folders,
});

export const getFolders = async () => {
  const res = await folderAPI.get("");
  return res.data;
};

export const createFolder = async (folder) => {
  const res = await folderAPI.post("", folder);
  return res.data;
};

export const updateFolder = async (id, folder) => {
  const res = await folderAPI.put(`/${id}`, folder);
  return res.data;
};

export const deleteFolder = async (id) => {
  await folderAPI.delete(`/${id}`);
};
