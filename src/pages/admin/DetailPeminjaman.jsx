import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DetailPeminjaman() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const fetchDetail = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/PeminjamanRuangan/${id}`)
      setItem(res.data || null)
    } catch (e) {
      const status = e?.response?.status
      setItem(null)
      setError(`Request failed with status code ${status || "?"}`)
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  function tanggalOnly(v) {
    if (!v) return "-"
    if (typeof v === "string" && v.includes("T")) return v.split("T")[0]
    return v
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Detail Peminjaman</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="text-sm text-muted-foreground">Memuat data...</div>
        ) : item ? (
          <div className="grid gap-3 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Nama</div>
              <div className="col-span-2">{item.namaPeminjam ?? item.nama_peminjam ?? "-"}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Ruangan</div>
              <div className="col-span-2">{item.namaRuangan ?? item.nama_ruangan ?? "-"}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Keperluan</div>
              <div className="col-span-2">{item.keperluan ?? "-"}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Tanggal</div>
              <div className="col-span-2">
                {tanggalOnly(item.tanggalPeminjaman ?? item.tanggal_peminjaman)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Jam Mulai</div>
              <div className="col-span-2">{item.jamMulai ?? item.jam_mulai ?? "-"}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Jam Selesai</div>
              <div className="col-span-2">{item.jamSelesai ?? item.jam_selesai ?? "-"}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">Status</div>
              <div className="col-span-2">{item.status ?? "-"}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Data tidak ditemukan.</div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button onClick={fetchDetail} disabled={loading}>
            {loading ? "Memuat..." : "Coba lagi"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
