import { create } from "axios";

const api = create({
  baseURL: "http://10.0.2.2:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;