import * as React from "react"
import axios from "axios"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

function normalizeBaseUrl(raw) {
  if (!raw) return "http://localhost:5218/api"
  const trimmed = raw.replace(/\/+$/, "")
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`
}

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL),
})

function formatDate(isoOrDate) {
  if (!isoOrDate) return "-"
  const d = new Date(isoOrDate)
  if (Number.isNaN(d.getTime())) return String(isoOrDate)
  return d.toISOString().slice(0, 10)
}

function formatTime(t) {
  if (!t) return "-"
  const s = String(t)
  return s.length >= 5 ? s.slice(0, 5) : s
}

function statusBadge(status) {
  const s = (status || "").toLowerCase()
  if (s.includes("setuju")) return <Badge className="bg-emerald-600 hover:bg-emerald-600">Disetujui</Badge>
  if (s.includes("tolak")) return <Badge variant="destructive">Ditolak</Badge>
  if (s.includes("menunggu")) return <Badge variant="secondary">Menunggu</Badge>
  return <Badge variant="outline">{status || "-"}</Badge>
}

function narasi(p) {
  const nama = p.namaPeminjam || "Seseorang"
  const ruangan = p.namaRuangan || "-"
  const tgl = formatDate(p.tanggalPeminjaman)
  const jam = `${formatTime(p.jamMulai)} - ${formatTime(p.jamSelesai)}`
  const keperluan = p.keperluan || "-"
  return `${nama} meminjam ${ruangan} pada ${tgl} jam ${jam} untuk ${keperluan}.`
}

function ambilStatusTerakhir(riwayat, fallbackStatus) {
  if (!Array.isArray(riwayat) || riwayat.length === 0) {
    return {
      status_sekarang: fallbackStatus || "-",
      diubah_oleh: "-",
      keterangan: "",
      waktu_perubahan: null,
      status_sebelumnya: null,
    }
  }

  const sorted = [...riwayat].sort((a, b) => {
    const da = new Date(a.waktu_perubahan || 0).getTime()
    const db = new Date(b.waktu_perubahan || 0).getTime()
    return db - da
  })

  const last = sorted[0]
  return {
    status_sekarang: last.status_sekarang ?? fallbackStatus ?? "-",
    status_sebelumnya: last.status_sebelumnya ?? null,
    diubah_oleh: last.diubah_oleh ?? "-",
    keterangan: last.keterangan ?? "",
    waktu_perubahan: last.waktu_perubahan ?? null,
  }
}

export default function RiwayatPeminjaman() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [query, setQuery] = React.useState("")
  const [items, setItems] = React.useState([])

  const fetchAll = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/PeminjamanRuangan")
      const list = Array.isArray(res.data) ? res.data : []

      const withHistory = await Promise.all(
        list.map(async (p) => {
          try {
            const r = await api.get(`/PeminjamanRuangan/${p.id}/riwayat-status`)
            const riwayat = Array.isArray(r.data) ? r.data : []
            const last = ambilStatusTerakhir(riwayat, p.status)

            return {
              ...p,
              _riwayat: riwayat,
              _last: last,
            }
          } catch {
            return {
              ...p,
              _riwayat: [],
              _last: ambilStatusTerakhir([], p.status),
            }
          }
        })
      )

      withHistory.sort((a, b) => {
        const da = new Date(a._last?.waktu_perubahan || a.tanggalPeminjaman || 0).getTime()
        const db = new Date(b._last?.waktu_perubahan || b.tanggalPeminjaman || 0).getTime()
        return db - da
      })

      setItems(withHistory)
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Gagal mengambil data dari backend."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => {
      const blob = [
        p.namaPeminjam,
        p.namaRuangan,
        p.keperluan,
        p.status,
        formatDate(p.tanggalPeminjaman),
        p._last?.status_sekarang,
        p._last?.diubah_oleh,
        p._last?.keterangan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return blob.includes(q)
    })
  }, [items, query])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: nama / ruangan / status / tanggal / keterangan"
            />
          </div>

          {error ? (
            <div className="rounded-md border p-4 text-sm">
              <div className="font-medium">Terjadi error</div>
              <div className="text-muted-foreground mt-1">{error}</div>
              <button
                className="mt-3 inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted"
                onClick={fetchAll}
              >
                Coba lagi
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-md border p-6 text-sm text-muted-foreground">
                  Tidak ada data riwayat yang cocok dengan pencarian.
                </div>
              ) : (
                filtered.map((p) => {
                  const last = p._last
                  const statusNow = last?.status_sekarang ?? p.status ?? "-"
                  const by = last?.diubah_oleh ?? "-"
                  const when = last?.waktu_perubahan ? formatDate(last.waktu_perubahan) : "-"
                  const ket = last?.keterangan || ""

                  return (
                    <Card key={p.id} className="border">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <div className="text-sm leading-relaxed">
                              {narasi(p)}{" "}
                              <span className="font-medium">
                                Status terakhir: {statusNow}
                              </span>
                              {by && by !== "-" ? (
                                <span className="text-muted-foreground">
                                  {" "}
                                  (oleh {by}, {when})
                                </span>
                              ) : (
                                <span className="text-muted-foreground"> ({when})</span>
                              )}
                            </div>

                            {ket ? (
                              <div className="text-xs text-muted-foreground">
                                Keterangan: {ket}
                              </div>
                            ) : null}
                          </div>

                          <div className="shrink-0">{statusBadge(statusNow)}</div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            ID Peminjaman: {p.id}
                          </div>

                          <Link
                            to={`/admin/detail/${p.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            Lihat lebih lanjut →
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
