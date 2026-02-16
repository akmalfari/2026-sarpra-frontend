import * as React from "react"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
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

export default function DataPeminjaman() {
  const [items, setItems] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [submittingId, setSubmittingId] = React.useState(null)

  const [resultOpen, setResultOpen] = React.useState(false)
  const [resultMessage, setResultMessage] = React.useState("")
  const [resultTitle, setResultTitle] = React.useState("")

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/PeminjamanRuangan")
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
      setItems(data)
    } catch (e) {
      const status = e?.response?.status
      setItems([])
      setError(`Gagal mengambil data peminjaman. (${status || "?"})`)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items

    return items.filter((p) => {
      const id = String(p.id ?? "")
      const nama = (p.namaPeminjam ?? p.nama_peminjam ?? p.nama ?? "").toLowerCase()
      const ruangan = (p.namaRuangan ?? p.nama_ruangan ?? p.ruangan ?? "").toLowerCase()
      const keperluan = (p.keperluan ?? "").toLowerCase()
      const tanggal = (p.tanggalPeminjaman ?? p.tanggal_peminjaman ?? p.tanggal ?? "").toLowerCase()
      const status = (p.status ?? "").toLowerCase()

      return (
        id.includes(q) ||
        nama.includes(q) ||
        ruangan.includes(q) ||
        keperluan.includes(q) ||
        tanggal.includes(q) ||
        status.includes(q)
      )
    })
  }, [items, search])

  function normalizeTanggal(value) {
    if (!value) return "-"
    if (typeof value === "string" && value.includes("T")) return value.split("T")[0]
    return value
  }

  async function updateStatus(id, status) {
    setError("")
    setSubmittingId(id)
    try {
      await api.put(`/PeminjamanRuangan/${id}/status`, { status })
      setItems((cur) => cur.map((x) => (String(x.id) === String(id) ? { ...x, status } : x)))
      setResultTitle("Berhasil")
      setResultMessage(status === "disetujui" ? "Data telah disetujui." : "Data telah ditolak.")
      setResultOpen(true)
    } catch (err) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengubah status peminjaman."
      setError(msg)
    } finally {
      setSubmittingId(null)
    }
  }

  async function updateStatus(id, status) {
  setError("")
  setSubmittingId(id)

  try {
    await api.patch(`/PeminjamanRuangan/${id}/status`, { status })

    setItems((cur) =>
      cur.map((x) => (String(x.id) === String(id) ? { ...x, status } : x))
    )

    setResultTitle("Berhasil")
    setResultMessage(status === "disetujui" ? "Data telah disetujui." : "Data telah ditolak.")
    setResultOpen(true)
  } catch (err) {
    const msg =
      err?.response?.data?.title ||
      err?.response?.data?.message ||
      err?.message ||
      "Gagal mengubah status peminjaman."
    setError(msg)
  } finally {
    setSubmittingId(null)
  }
}

  function StatusCell({ id, status }) {
    const st = String(status || "").toLowerCase()

    if (st === "menunggu") {
      return (
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={submittingId === id}>
                {submittingId === id ? "Memproses..." : "Accept"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Setujui peminjaman ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Status akan berubah menjadi disetujui dan akan terlihat di halaman user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => updateStatus(id, "disetujui")}>
                  Setujui
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={submittingId === id}>
                Tolak
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tolak peminjaman ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Status akan berubah menjadi ditolak dan akan terlihat di halaman user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => updateStatus(id, "ditolak")}>
                  Tolak
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }

    return <span className="capitalize">{st || "-"}</span>
  }

  function AksiCell({ id }) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link to={`/admin/detail/${id}`}>Detail</Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={submittingId === id}>
            Hapus
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data peminjaman?</AlertDialogTitle>
            <AlertDialogDescription>
              Data peminjaman ini akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePeminjaman(id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

  

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Peminjaman Ruangan</CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{filtered.length} data</div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search nama / ruangan / keperluan / tanggal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Ruangan</th>
                <th className="p-3 text-left">Keperluan</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={7}>
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={7}>
                    Data peminjaman kosong.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const id = p.id ?? idx
                  const nama = p.namaPeminjam ?? p.nama_peminjam ?? p.nama ?? "-"
                  const ruangan = p.namaRuangan ?? p.nama_ruangan ?? p.ruangan ?? "-"
                  const keperluan = p.keperluan ?? "-"
                  const tanggal = normalizeTanggal(p.tanggalPeminjaman ?? p.tanggal_peminjaman ?? p.tanggal)
                  const status = p.status ?? "-"

                  return (
                    <tr key={id} className="border-b">
                      <td className="p-3">{id}</td>
                      <td className="p-3">{nama}</td>
                      <td className="p-3">{ruangan}</td>
                      <td className="p-3">{keperluan}</td>
                      <td className="p-3">{tanggal}</td>
                      <td className="p-3">
                        <StatusCell id={id} status={status} />
                      </td>
                      <td className="p-3">
                        <AksiCell id={id} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <AlertDialog open={resultOpen} onOpenChange={setResultOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{resultTitle}</AlertDialogTitle>
              <AlertDialogDescription>{resultMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setResultOpen(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
