import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RiwayatPeminjaman() {
  const dataRiwayat = [
    {
      id: 1,
      nama: "Zalfa",
      ruangan: "D4",
      tanggal: "2026-02-12",
      jam: "08:00 - 10:00",
      keperluan: "Kuliah",
      status: "disetujui",
      oleh: "Admin",
    },
    {
      id: 2,
      nama: "Akmal",
      ruangan: "Lab Komputer 1",
      tanggal: "2026-02-14",
      jam: "08:00 - 10:00",
      keperluan: "Praktikum",
      status: "ditolak",
      oleh: "Admin",
    },
    {
      id: 3,
      nama: "Jalpa",
      ruangan: "Lap Voli",
      tanggal: "2026-02-12",
      jam: "08:00 - 12:00",
      keperluan: "Latihan",
      status: "disetujui",
      oleh: "Admin",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Peminjaman</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {dataRiwayat.map((item) => (
            <div
              key={item.id}
              className="border-l-4 pl-4 py-3 rounded-md bg-muted/40"
            >
              <p className="text-sm">
                <span className="font-semibold">{item.nama}</span> meminjam{" "}
                <span className="font-semibold">{item.ruangan}</span> pada{" "}
                <span className="font-medium">{item.tanggal}</span> jam{" "}
                <span className="font-medium">{item.jam}</span> untuk{" "}
                <span className="italic">{item.keperluan}</span> dan telah{" "}
                <span
                  className={
                    item.status === "disetujui"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {item.status}
                </span>{" "}
                oleh {item.oleh}.
              </p>

              <div className="mt-2">
                <Link to={`/admin/detail/${item.id}`}>
                  <Button variant="link" className="px-0">
                    Lihat lebih lanjut →
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          <p className="text-xs text-muted-foreground">
            *Masih menggunakan data dummy. Nanti diganti dari backend API.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
