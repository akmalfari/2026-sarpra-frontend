import * as React from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5218"

function normalizeStatus(v) {
  const s = String(v ?? "").toLowerCase()
  if (s.includes("setuju")) return "disetujui"
  if (s.includes("tolak")) return "ditolak"
  if (s.includes("menunggu") || s.includes("pending")) return "menunggu"
  return s || "menunggu"
}

function StatusPill({ status }) {
  const s = normalizeStatus(status)
  const cls =
    s === "disetujui"
      ? "text-green-600"
      : s === "ditolak"
        ? "text-red-600"
        : "text-muted-foreground"
  return <span className={cls}>{s}</span>
}

export default function DataRuangan() {
  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [q, setQ] = React.useState("")
  const [error, setError] = React.useState("")
  const [pendingActionId, setPendingActionId] = React.useState(null)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get(`${API_BASE}/api/PeminjamanRuangan`)
      const data = Array.isArray(res.data) ? res.data : []
      setRows(data)
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
    fetchData()
  }, [fetchData])

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows

    return rows.filter((r) => {
      const id = String(r.id ?? r.peminjamanRuanganId ?? "")
      const nama = String(r.namaPeminjam ?? r.nama ?? "")
      const ruangan = String(r.namaRuangan ?? r.ruangan ?? "")
      const keperluan = String(r.keperluan ?? "")
      const tanggal = String(
        r.tanggalPeminjaman ?? r.tanggal ?? r.tanggalPinjam ?? ""
      )
      const status = String(r.status ?? "")
      const jamMulai = String(r.jamMulai ?? "")
      const jamSelesai = String(r.jamSelesai ?? "")

      const blob = [
        id,
        nama,
        ruangan,
        keperluan,
        tanggal,
        status,
        jamMulai,
        jamSelesai,
      ]
        .join(" ")
        .toLowerCase()

      return blob.includes(term)
    })
  }, [rows, q])

  async function updateStatus(id, nextStatus) {
    setPendingActionId(id)
    setError("")
    try {
      await axios.patch(`${API_BASE}/api/PeminjamanRuangan/${id}/status`, {
        status: nextStatus,
      })

      setRows((prev) =>
        prev.map((r) => {
          const rid = r.id ?? r.peminjamanRuanganId
          if (String(rid) !== String(id)) return r
          return { ...r, status: nextStatus }
        })
      )
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Gagal mengubah status."
      )
    } finally {
      setPendingActionId(null)
    }
  }

  async function deletePeminjaman(id) {
    setPendingActionId(id)
    setError("")
    try {
      await axios.delete(`${API_BASE}/api/PeminjamanRuangan/${id}`)
      setRows((prev) =>
        prev.filter((r) => String(r.id ?? r.peminjamanRuanganId) !== String(id))
      )
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Gagal menghapus data."
      )
    } finally {
      setPendingActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Peminjaman Ruangan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Kelola data peminjaman: setujui, tolak, atau hapus.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Peminjaman Ruangan</CardTitle>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search nama / ruangan / keperluan / tanggal / status"
              className="md:max-w-xl"
            />
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={loading}
              className="md:w-auto"
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead className="w-[140px]">Tanggal</TableHead>
                  <TableHead className="w-[160px]">Jam</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="text-right w-[260px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      {loading ? "Memuat data..." : "Tidak ada data."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const id = r.id ?? r.peminjamanRuanganId
                    const nama = r.namaPeminjam ?? r.nama ?? "-"
                    const ruangan = r.namaRuangan ?? r.ruangan ?? "-"
                    const keperluan = r.keperluan ?? "-"
                    const tanggal =
                      r.tanggalPeminjaman ?? r.tanggal ?? r.tanggalPinjam ?? "-"
                    const jam = `${r.jamMulai ?? "-"} - ${r.jamSelesai ?? "-"}`
                    const status = normalizeStatus(r.status)
                    const isBusy = String(pendingActionId) === String(id)
                    const isPending = status === "menunggu"

                    return (
                      <TableRow key={String(id)}>
                        <TableCell className="font-medium">
                          {String(id)}
                        </TableCell>
                        <TableCell>{nama}</TableCell>
                        <TableCell>{ruangan}</TableCell>
                        <TableCell>{keperluan}</TableCell>
                        <TableCell>{String(tanggal).slice(0, 10)}</TableCell>
                        <TableCell>{jam}</TableCell>
                        <TableCell>
                          <StatusPill status={status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              size="sm"
                              disabled={!isPending || isBusy}
                              onClick={() => updateStatus(id, "disetujui")}
                            >
                              Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!isPending || isBusy}
                              onClick={() => updateStatus(id, "ditolak")}
                            >
                              Reject
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={isBusy}
                                >
                                  Hapus
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus peminjaman {String(nama)}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Data akan dihapus permanen dari database.
                                    Tindakan ini tidak bisa dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deletePeminjaman(id)}
                                  >
                                    Ya, hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Menampilkan {filtered.length} data.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
