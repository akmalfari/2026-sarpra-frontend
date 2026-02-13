import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DetailPeminjaman() {
  const { id } = useParams()

  // dummy data
  const data = {
    id,
    nama: "Zalfa",
    ruangan: "Lab Komputer 1",
    tanggal: "2026-02-14",
    jam: "08:00 - 10:00",
    keperluan: "Praktikum",
    status: "disetujui",
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Detail Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><b>Nama:</b> {data.nama}</p>
          <p><b>Ruangan:</b> {data.ruangan}</p>
          <p><b>Tanggal:</b> {data.tanggal}</p>
          <p><b>Jam:</b> {data.jam}</p>
          <p><b>Keperluan:</b> {data.keperluan}</p>
          <p><b>Status:</b> {data.status}</p>

          <div className="pt-4">
            <Link to="/admin/riwayat-peminjaman">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
