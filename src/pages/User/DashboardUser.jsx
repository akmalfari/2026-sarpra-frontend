import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TypingAnimation } from "@/components/ui/typing-animation"

const dummyPeminjaman = [
  {
    id: 21,
    nama_peminjam: "Akmal",
    nama_ruangan: "Lab Komputer 1",
    keperluan: "Praktikum",
    tanggal_peminjaman: "2026-02-13",
    jam_mulai: "08:00",
    jam_selesai: "10:00",
    status: "menunggu",
  },
  {
    id: 22,
    nama_peminjam: "Zalfa",
    nama_ruangan: "Aula",
    keperluan: "Rapat",
    tanggal_peminjaman: "2026-02-13",
    jam_mulai: "13:00",
    jam_selesai: "15:00",
    status: "disetujui",
  },
  {
    id: 23,
    nama_peminjam: "Dika",
    nama_ruangan: "D4",
    keperluan: "Kuliah",
    tanggal_peminjaman: "2026-02-14",
    jam_mulai: "09:00",
    jam_selesai: "11:00",
    status: "ditolak",
  },
]

function badgeClass(status) {
  if (status === "disetujui") return "text-green-600"
  if (status === "ditolak") return "text-red-600"
  return "text-muted-foreground"
}

export default function DashboardUser() {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("semua")

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return dummyPeminjaman.filter((x) => {
      const matchText =
        !query ||
        `${x.nama_peminjam} ${x.nama_ruangan} ${x.keperluan} ${x.tanggal_peminjaman}`
          .toLowerCase()
          .includes(query)

      const matchStatus = status === "semua" ? true : x.status === status
      return matchText && matchStatus
    })
  }, [q, status])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dashboard User</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="mb-2">
            <TypingAnimation>Selamat datang di SARPRA User.</TypingAnimation>
          </div>
          Buat peminjaman dan pantau status pengajuanmu.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Peminjaman</CardTitle>
          <Button asChild>
            <Link to="/user/buat">Buat Peminjaman</Link>
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search: ruangan / keperluan / tanggal"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="semua">Semua status</option>
              <option value="menunggu">Menunggu</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell className="font-medium">{x.id}</TableCell>
                    <TableCell>{x.nama_ruangan}</TableCell>
                    <TableCell>{x.keperluan}</TableCell>
                    <TableCell>{x.tanggal_peminjaman}</TableCell>
                    <TableCell>
                      {x.jam_mulai} - {x.jam_selesai}
                    </TableCell>
                    <TableCell className={badgeClass(x.status)}>{x.status}</TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-xs text-muted-foreground">
            Data masih dummy. Nanti diganti dari API backend.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
