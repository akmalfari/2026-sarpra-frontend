import api from "@/lib/axios";

export const getRuangan = () => api.get("/Ruangan");
export const getRuanganTersedia = () => api.get("/Ruangan/tersedia");
// kalau butuh:
export const updateStatusRuangan = (id, payload) => api.put(`/Ruangan/${id}/status`, payload);
export const createRuangan = (payload) => api.post("/Ruangan", payload);
