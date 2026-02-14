import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function BuatPeminjaman() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nama_peminjam: "User",
    nama_ruangan: "",
    keperluan: "",
    tanggal_peminjaman: "",
    jam_mulai: "",
    jam_selesai: "",
  })

  function onChange(key, value) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    navigate("/user/dashboard", { replace: true })
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Buat Peminjaman</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label>Nama Peminjam</Label>
              <Input value={form.nama_peminjam} onChange={(e) => onChange("nama_peminjam", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Nama Ruangan</Label>
              <Input value={form.nama_ruangan} onChange={(e) => onChange("nama_ruangan", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Keperluan</Label>
              <Input value={form.keperluan} onChange={(e) => onChange("keperluan", e.target.value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2 md:col-span-1">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={form.tanggal_peminjaman}
                  onChange={(e) => onChange("tanggal_peminjaman", e.target.value)}
                />
              </div>

              <div className="grid gap-2 md:col-span-1">
                <Label>Jam Mulai</Label>
                <Input
                  type="time"
                  value={form.jam_mulai}
                  onChange={(e) => onChange("jam_mulai", e.target.value)}
                />
              </div>

              <div className="grid gap-2 md:col-span-1">
                <Label>Jam Selesai</Label>
                <Input
                  type="time"
                  value={form.jam_selesai}
                  onChange={(e) => onChange("jam_selesai", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate("/user/dashboard")}>
                Batal
              </Button>
              <Button type="submit">Kirim Pengajuan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
