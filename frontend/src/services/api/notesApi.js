import axios from "axios";
import { API_ENDPOINTS } from "../config.js";

const noteAPI = axios.create({
  baseURL: API_ENDPOINTS.notes,
});

export const getNotesByFolder = async (folderId) => {
  const res = await noteAPI.get("", { params: { folderId } });
  return res.data;
};

export const createNote = async (note) => {
  const res = await noteAPI.post("", note);
  return res.data;
};

export const updateNote = async (id, note) => {
  const res = await noteAPI.put(`/${id}`, note);
  return res.data;
};

export const deleteNote = async (id) => {
  await noteAPI.delete(`/${id}`);
};
