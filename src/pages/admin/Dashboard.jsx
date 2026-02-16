import axios from "axios"
import { useEffect, useMemo, useState } from "react"

export default function Dashboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [q, setQ] = useState("")

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        setLoading(true)
        setError("")
        const res = await axios.get("http://localhost:5218/api/PeminjamanRuangan")
        if (!mounted) return
        setRows(Array.isArray(res.data) ? res.data : [])
      } catch (e) {
        if (!mounted) return
        setError(e?.message || "Gagal memuat data")
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter((r) => {
      const nama = String(r.namaPeminjam ?? "").toLowerCase()
      const ruangan = String(r.namaRuangan ?? "").toLowerCase()
      const keperluan = String(r.keperluan ?? "").toLowerCase()
      const tanggal = String(r.tanggalPeminjaman ?? "").toLowerCase()
      return nama.includes(s) || ruangan.includes(s) || keperluan.includes(s) || tanggal.includes(s)
    })
  }, [rows, q])

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-card p-6">
        <div className="text-xl font-semibold">Dashboard SARPRA</div>
        <div className="mt-2 text-sm text-muted-foreground">Selamat datang di SARPRA Admin.</div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="text-lg font-semibold">Peminjaman Ruangan</div>

        <div className="mt-4">
          <input
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="Search nama / ruangan / keperluan / tanggal"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="mt-4 rounded-md border">
          <div className="grid grid-cols-8 gap-0 border-b bg-muted/40 text-sm font-medium">
            <div className="p-3">ID</div>
            <div className="p-3 col-span-2">Nama</div>
            <div className="p-3">Ruangan</div>
            <div className="p-3 col-span-2">Keperluan</div>
            <div className="p-3">Tanggal</div>
            <div className="p-3">Status</div>
          </div>

          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">Tidak ada data.</div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="grid grid-cols-8 border-b last:border-b-0 text-sm">
                <div className="p-3">{r.id}</div>
                <div className="p-3 col-span-2">{r.namaPeminjam}</div>
                <div className="p-3">{r.namaRuangan}</div>
                <div className="p-3 col-span-2">{r.keperluan}</div>
                <div className="p-3">{String(r.tanggalPeminjaman).slice(0, 10)}</div>
                <div className="p-3">{r.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
