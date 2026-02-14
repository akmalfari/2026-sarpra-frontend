import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummy = [
  { id: 31, nama_ruangan: "Aula", keperluan: "Rapat", tanggal: "2026-02-13", jam: "13:00 - 15:00", status: "disetujui" },
  { id: 32, nama_ruangan: "Lab Komputer 2", keperluan: "Praktikum", tanggal: "2026-02-14", jam: "08:00 - 10:00", status: "disetujui" },
  { id: 33, nama_ruangan: "D4", keperluan: "Kuliah", tanggal: "2026-02-12", jam: "09:00 - 11:00", status: "ditolak" },
]

export default function PeminjamanBerlangsung() {
  const [q, setQ] = useState("")

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return dummy
      .filter((x) => x.status === "disetujui")
      .filter((x) => {
        if (!query) return true
        return `${x.nama_ruangan} ${x.keperluan} ${x.tanggal}`.toLowerCase().includes(query)
      })
  }, [q])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Peminjaman Berlangsung</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Menampilkan peminjaman yang sudah disetujui (dummy).
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <Input
            placeholder="Search: ruangan / keperluan / tanggal"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell className="font-medium">{x.id}</TableCell>
                    <TableCell>{x.nama_ruangan}</TableCell>
                    <TableCell>{x.keperluan}</TableCell>
                    <TableCell>{x.tanggal}</TableCell>
                    <TableCell>{x.jam}</TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada peminjaman berlangsung.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
