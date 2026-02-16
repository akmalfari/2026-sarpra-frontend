import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  return [];
}

function statusLabel(s) {
  const v = (s || "").toLowerCase();
  if (v.includes("setuju")) return "disetujui";
  if (v.includes("tolak")) return "ditolak";
  return "menunggu";
}

function statusClass(s) {
  const v = statusLabel(s);
  if (v === "disetujui") return "text-green-600";
  if (v === "ditolak") return "text-red-600";
  return "text-muted-foreground";
}

export default function PeminjamanBerlangsung() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("menunggu");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/PeminjamanRuangan");
        const arr = normalizeArray(res.data);

        if (!alive) return;
        setRows(arr);
      } catch (e) {
        if (!alive) return;
        setError("Gagal memuat data dari backend.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows
      .filter((r) => {
        const status = statusLabel(r.status);
        const matchStatus = statusFilter === "semua" ? true : status === statusFilter;

        const ruangan = (r.namaRuangan || "").toLowerCase();
        const keperluan = (r.keperluan || "").toLowerCase();
        const tanggal = String(r.tanggalPeminjaman || "").toLowerCase();

        const matchQuery =
          !query ||
          ruangan.includes(query) ||
          keperluan.includes(query) ||
          tanggal.includes(query);

        return matchStatus && matchQuery;
      })
      .sort((a, b) => (String(b.tanggalPeminjaman || "") > String(a.tanggalPeminjaman || "") ? 1 : -1));
  }, [rows, q, statusFilter]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Peminjaman Berlangsung</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pantau peminjaman kamu berdasarkan status.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: ruangan / keperluan / tanggal"
              className="md:col-span-2"
            />
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="semua">Semua status</option>
              <option value="menunggu">menunggu</option>
              <option value="disetujui">disetujui</option>
              <option value="ditolak">ditolak</option>
            </select>
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead className="w-[140px]">Tanggal</TableHead>
                  <TableHead className="w-[160px]">Jam</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const jam = `${r.jamMulai || "-"} - ${r.jamSelesai || "-"}`;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.namaRuangan}</TableCell>
                        <TableCell>{r.keperluan}</TableCell>
                        <TableCell>{String(r.tanggalPeminjaman || "").slice(0, 10)}</TableCell>
                        <TableCell>{jam}</TableCell>
                        <TableCell className={statusClass(r.status)}>{statusLabel(r.status)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
