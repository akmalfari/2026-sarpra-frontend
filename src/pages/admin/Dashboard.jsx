import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypingAnimation } from "@/components/ui/typing-animation";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Dashboard() {
  const today = todayISO();

  // dummy data
  const initialRows = useMemo(
    () => [
      {
        id: 10,
        namaPeminjam: "Akmal",
        ruangan: "Aula",
        keperluan: "Rapat",
        tanggal: today,
        jamMulai: "13:00",
        jamSelesai: "15:00",
        status: "disetujui",
      },
      {
        id: 11,
        namaPeminjam: "Dika",
        ruangan: "D4",
        keperluan: "Kuliah",
        tanggal: today,
        jamMulai: "08:00",
        jamSelesai: "10:00",
        status: "disetujui",
      },
      {
        id: 12,
        namaPeminjam: "Jalpa",
        ruangan: "Lap Voli",
        keperluan: "Latihan",
        tanggal: today,
        jamMulai: "08:00",
        jamSelesai: "12:00",
        status: "menunggu",
      },
      {
        id: 13,
        namaPeminjam: "Nanda",
        ruangan: "Lab Komputer 1",
        keperluan: "Praktikum",
        tanggal: "2026-02-14",
        jamMulai: "08:00",
        jamSelesai: "10:00",
        status: "ditolak",
      },
    ],
    [today]
  );

  const [rows] = useState(initialRows);

  // search + filter status
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | disetujui | ditolak | menunggu

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows
      .filter((r) => {
        const matchStatus = status === "all" ? true : r.status === status;

        if (!matchStatus) return false;
        if (!query) return true;

        const hay = `${r.namaPeminjam} ${r.ruangan} ${r.keperluan} ${r.tanggal} ${r.status}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => {
        // sort: tanggal desc, jam asc
        if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
        return a.jamMulai.localeCompare(b.jamMulai);
      });
  }, [rows, q, status]);

  const statusLabel = (s) => {
    if (s === "disetujui") return "Disetujui";
    if (s === "ditolak") return "Ditolak";
    if (s === "menunggu") return "Menunggu";
    return s;
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>
            Dashboard SARPRA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
         <TypingAnimation> Selamat datang di SARPRA Admin.</TypingAnimation>
        </CardContent>
      </Card>

      {/* Search + Filter + Table */}
      <Card>
        <CardHeader className="gap-3">
          <CardTitle className="text-base">Pencarian Peminjaman</CardTitle>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: nama peminjam / ruangan / keperluan / tanggal..."
            />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-3 text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            data {status !== "all" ? `(${statusLabel(status)})` : ""}.
          </div>

          <div className="w-full overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.namaPeminjam}</TableCell>
                    <TableCell>{r.ruangan}</TableCell>
                    <TableCell>{r.keperluan}</TableCell>
                    <TableCell>{r.tanggal}</TableCell>
                    <TableCell>
                      {r.jamMulai} - {r.jamSelesai}
                    </TableCell>
                    <TableCell>{statusLabel(r.status)}</TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            *Masih dummy. Nanti filter ini tetap dipakai saat data dari backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
