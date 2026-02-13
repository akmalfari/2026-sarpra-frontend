import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function Dashboard() {
  // dummy data
  const initialRows = useMemo(
    () => [
      {
        id: 5,
        namaPeminjam: "Dika",
        ruangan: "D4",
        keperluan: "Kuliah",
        tanggal: "2026-02-12",
        jamMulai: "08:00",
        jamSelesai: "10:00",
        status: "menunggu",
      },
      {
        id: 4,
        namaPeminjam: "Jalpa",
        ruangan: "Lap Voli",
        keperluan: "Latihan",
        tanggal: "2026-02-12",
        jamMulai: "08:00",
        jamSelesai: "12:00",
        status: "menunggu",
      },
      {
        id: 2,
        namaPeminjam: "Akmal",
        ruangan: "Aula",
        keperluan: "Rapat",
        tanggal: "2026-02-13",
        jamMulai: "13:00",
        jamSelesai: "15:00",
        status: "disetujui",
      },
      {
        id: 1,
        namaPeminjam: "Akmal",
        ruangan: "Lab Komputer 1",
        keperluan: "Praktikum",
        tanggal: "2026-02-14",
        jamMulai: "08:00",
        jamSelesai: "10:00",
        status: "ditolak",
      },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);

  const approve = (id) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "disetujui" } : r))
    );
  };

  const reject = (id) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "ditolak" } : r))
    );
  };

  const statusClass = (status) => {
    if (status === "disetujui") return "text-green-600";
    if (status === "ditolak") return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="grid gap-6">
      {/* Card 1: Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>
           Data Peminjaman Ruangan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Selamat datang di SARPRA Admin.
        </CardContent>
      </Card>

      {/* Card 2: Table Peminjaman (dummy) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peminjaman Ruangan (Terbaru)</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Nama Peminjam</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.namaPeminjam}</TableCell>
                    <TableCell>{r.ruangan}</TableCell>
                    <TableCell>{r.keperluan}</TableCell>
                    <TableCell>{r.tanggal}</TableCell>
                    <TableCell>
                      {r.jamMulai} - {r.jamSelesai}
                    </TableCell>
                    <TableCell className={statusClass(r.status)}>
                      {r.status}
                    </TableCell>

                    <TableCell className="text-right">
                      {r.status === "menunggu" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => approve(r.id)}>
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reject(r.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Tidak ada aksi
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      Belum ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
           Sarana dan Prasarana
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
