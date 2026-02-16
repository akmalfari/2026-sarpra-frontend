import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function normalizeStatus(value) {
  if (!value) return "menunggu"
  const v = String(value).toLowerCase()
  if (v.includes("setuju") || v === "approved") return "disetujui"
  if (v.includes("tolak") || v === "rejected") return "ditolak"
  if (v.includes("tunggu") || v === "pending") return "menunggu"
  return v
}

function badgeVariantFromStatus(status) {
  const s = normalizeStatus(status)
  if (s === "disetujui") return "default"
  if (s === "ditolak") return "destructive"
  return "secondary"
}

function formatDate(value) {
  if (!value) return "-"
  const str = String(value)
  return str.length >= 10 ? str.slice(0, 10) : str
}

function formatTimeRange(jamMulai, jamSelesai) {
  if (!jamMulai && !jamSelesai) return "-"
  const a = jamMulai ? String(jamMulai).slice(0, 5) : "-"
  const b = jamSelesai ? String(jamSelesai).slice(0, 5) : "-"
  return `${a} - ${b}`
}

export default function DetailPeminjaman() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [item, setItem] = React.useState(null)

  const apiBase =
    import.meta.env.VITE_API_URL?.trim() || "http://localhost:5218"

  React.useEffect(() => {
    let alive = true

    async function fetchDetail() {
      try {
        setLoading(true)
        setError("")

        const url = `${apiBase.replace(/\/$/, "")}/api/PeminjamanRuangan/${id}`
        const res = await axios.get(url)

        const payload = res?.data?.data ?? res?.data ?? null

        if (!payload || typeof payload !== "object") {
          throw new Error("Data detail tidak valid dari server.")
        }

        if (alive) setItem(payload)
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Gagal mengambil detail peminjaman."
        if (alive) setError(String(msg))
      } finally {
        if (alive) setLoading(false)
      }
    }

    if (id) fetchDetail()

    return () => {
      alive = false
    }
  }, [apiBase, id])

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Detail Peminjaman</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-6 w-1/3" />
              <div className="pt-2">
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
                {error}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Kembali
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Coba lagi
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                <div className="flex gap-2">
                  <div className="w-28 font-semibold">Nama</div>
                  <div className="text-muted-foreground">
                    {item?.namaPeminjam || item?.NamaPeminjam || "-"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-28 font-semibold">Ruangan</div>
                  <div className="text-muted-foreground">
                    {item?.namaRuangan || item?.NamaRuangan || "-"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-28 font-semibold">Tanggal</div>
                  <div className="text-muted-foreground">
                    {formatDate(
                      item?.tanggalPeminjaman || item?.TanggalPeminjaman
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-28 font-semibold">Jam</div>
                  <div className="text-muted-foreground">
                    {formatTimeRange(
                      item?.jamMulai || item?.JamMulai,
                      item?.jamSelesai || item?.JamSelesai
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-28 font-semibold">Keperluan</div>
                  <div className="text-muted-foreground">
                    {item?.keperluan || item?.Keperluan || "-"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-28 font-semibold">Status</div>
                  <Badge variant={badgeVariantFromStatus(item?.status || item?.Status)}>
                    {normalizeStatus(item?.status || item?.Status)}
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Kembali
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
