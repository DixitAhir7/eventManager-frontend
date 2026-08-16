import axios from "axios";

export const api = axios.create({
  baseURL: "/api" || "http://localhost:5000/api",
  timeout: 10000,
});