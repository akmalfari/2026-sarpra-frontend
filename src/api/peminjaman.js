import { api } from "./axios";

export async function getPeminjaman() {
  const res = await api.get("/api/PeminjamanRuangan");
  return res.data;
}
