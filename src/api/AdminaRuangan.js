import api from "@/lib/axios";

export const getAllRuangan = () => api.get("/Ruangan");
export const createRuangan = (payload) => api.post("/Ruangan", payload);
export const updateRuanganStatus = (id, status) =>
  api.put(`/Ruangan/${id}/status`, { status });
export const deleteRuangan = (id) => api.delete(`/Ruangan/${id}`);
