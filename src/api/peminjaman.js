import api from "@/lib/axios";

export const getPeminjaman = () => api.get("/PeminjamanRuangan");
export const getPeminjamanById = (id) => api.get(`/PeminjamanRuangan/${id}`);
export const createPeminjaman = (payload) => api.post("/PeminjamanRuangan", payload);
export const deletePeminjaman = (id) => api.delete(`/PeminjamanRuangan/${id}`);
export const updateStatusPeminjaman = (id, payload) => api.patch(`/PeminjamanRuangan/${id}/status`, payload);
