import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getAllNotes = async () => {
  const res = await API.get("/notes");
  return res.data;
};

export const createNote = async (note) => {
  const res = await API.post("/notes", note);
  return res.data;
};

export const updateNote = async (id, updated) => {
  const res = await API.put(`/notes/${id}`, updated);
  return res.data;
};

export const deleteNote = async (id) => {
  await API.delete(`/notes/${id}`);
};
