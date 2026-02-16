import * as React from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RuanganTersedia() {
  const [items, setItems] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/Ruangan/tersedia");
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setItems(data);
    } catch (e) {
      const status = e?.response?.status;
      setItems([]);
      setError(`Gagal mengambil data ruangan tersedia. (${status || "?"})`);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((r) => {
      const nama = (r.namaRuangan ?? r.nama_ruangan ?? r.nama ?? r.name ?? "").toLowerCase();
      const ket = (r.keterangan ?? r.deskripsi ?? "").toLowerCase();
      const status = (r.status ?? "").toLowerCase();
      return nama.includes(q) || ket.includes(q) || status.includes(q);
    });
  }, [items, search]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Ruangan Tersedia</CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{filtered.length} ruangan</div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search: nama / keterangan / status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-3 text-left">Nama Ruangan</th>
                <th className="p-3 text-left">Keterangan</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={3}>
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={3}>
                    Tidak ada ruangan tersedia.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const nama = r.namaRuangan ?? r.nama_ruangan ?? r.nama ?? r.name ?? "-";
                  const ket = r.keterangan ?? r.deskripsi ?? "-";
                  const status = r.status ?? "-";

                  return (
                    <tr key={r.id ?? r.ruanganId ?? idx} className="border-b">
                      <td className="p-3">{nama}</td>
                      <td className="p-3">{ket}</td>
                      <td className="p-3">{status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
