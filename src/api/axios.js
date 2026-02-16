import axios from "axios";

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5218";
// pastikan baseURL selalu berakhir .../api (tanpa double slash)
const baseURL = rawBase.replace(/\/+$/, "") + "/api";

const api = axios.create({ baseURL });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data || err?.message;
    console.error("API Error:", msg);
    return Promise.reject(err);
  }
);

export default api;
