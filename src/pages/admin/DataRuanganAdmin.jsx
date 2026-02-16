import * as React from "react"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

export default function DataRuanganAdmin() {
  const [items, setItems] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [submittingId, setSubmittingId] = React.useState(null)

  const [resultOpen, setResultOpen] = React.useState(false)
  const [resultTitle, setResultTitle] = React.useState("")
  const [resultMessage, setResultMessage] = React.useState("")

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/Ruangan")
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
      setItems(data)
    } catch (e) {
      const status = e?.response?.status
      setItems([])
      setError(`Gagal mengambil data ruangan. (${status || "?"})`)
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

    return items.filter((r) => {
      const id = String(r.id ?? "")
      const nama = (r.namaRuangan ?? r.nama_ruangan ?? "").toLowerCase()
      const ket = (r.keterangan ?? "").toLowerCase()
      const status = (r.status ?? "").toLowerCase()
      return id.includes(q) || nama.includes(q) || ket.includes(q) || status.includes(q)
    })
  }, [items, search])

  async function updateRuanganStatus(id, status) {
    setError("")
    setSubmittingId(id)
    try {
      await api.put(`/Ruangan/${id}/status`, { status })
      setItems((cur) =>
        cur.map((x) => (String(x.id) === String(id) ? { ...x, status } : x))
      )
      setResultTitle("Berhasil")
      setResultMessage(`Status ruangan berhasil diubah menjadi ${status}.`)
      setResultOpen(true)
    } catch (err) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengubah status ruangan."
      setError(msg)
    } finally {
      setSubmittingId(null)
    }
  }

  async function deleteRuangan(id) {
    setError("")
    setSubmittingId(id)
    try {
      await api.delete(`/Ruangan/${id}`)
      setItems((cur) => cur.filter((x) => String(x.id) !== String(id)))
      setResultTitle("Berhasil")
      setResultMessage("Ruangan berhasil dihapus.")
      setResultOpen(true)
    } catch (err) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menghapus ruangan."
      setError(msg)
    } finally {
      setSubmittingId(null)
    }
  }

  function StatusCell({ id, status }) {
    const st = String(status || "").toLowerCase()
    const disabled = submittingId === id

    return (
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={disabled} variant={st === "tersedia" ? "default" : "outline"}>
              tersedia
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ubah status menjadi tersedia?</AlertDialogTitle>
              <AlertDialogDescription>
                Ruangan akan muncul di dropdown user sebagai ruangan tersedia.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => updateRuanganStatus(id, "tersedia")}>
                Simpan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={disabled} variant={st === "maintenance" ? "default" : "outline"}>
              maintenance
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ubah status menjadi maintenance?</AlertDialogTitle>
              <AlertDialogDescription>
                Ruangan tidak akan muncul di dropdown user sebagai ruangan tersedia.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => updateRuanganStatus(id, "maintenance")}>
                Simpan
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
        <CardTitle>Data Ruangan</CardTitle>
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
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nama Ruangan</th>
                <th className="p-3 text-left">Keterangan</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={5}>
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={5}>
                    Tidak ada data ruangan.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const id = r.id ?? idx
                  const nama = r.namaRuangan ?? r.nama_ruangan ?? "-"
                  const ket = r.keterangan ?? "-"
                  const status = r.status ?? "-"

                  return (
                    <tr key={id} className="border-b">
                      <td className="p-3">{id}</td>
                      <td className="p-3">{nama}</td>
                      <td className="p-3">{ket}</td>
                      <td className="p-3">
                        <StatusCell id={id} status={status} />
                      </td>
                      <td className="p-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" disabled={submittingId === id}>
                              Hapus
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus ruangan?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ruangan akan dihapus permanen dan tidak muncul di halaman user.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRuangan(id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
