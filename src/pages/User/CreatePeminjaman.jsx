import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/axios"
import { getRuanganTersedia } from "@/api/ruangan"

export default function CreatePeminjaman() {
  const [namaPeminjam, setNamaPeminjam] = React.useState("")
  const [namaRuangan, setNamaRuangan] = React.useState("")
  const [keperluan, setKeperluan] = React.useState("")
  const [tanggal, setTanggal] = React.useState("")
  const [jamMulai, setJamMulai] = React.useState("")
  const [jamSelesai, setJamSelesai] = React.useState("")

  const [ruangan, setRuangan] = React.useState([])
  const [loadingRuangan, setLoadingRuangan] = React.useState(true)
  const [errorRuangan, setErrorRuangan] = React.useState("")

  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState("")
  const [submitSuccess, setSubmitSuccess] = React.useState("")

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoadingRuangan(true)
        setErrorRuangan("")
        const res = await getRuanganTersedia()
        const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
        if (!mounted) return
        setRuangan(list)
      } catch (e) {
        if (!mounted) return
        setRuangan([])
        setErrorRuangan(
          "Gagal mengambil daftar ruangan tersedia. Pastikan endpoint /api/Ruangan/tersedia bisa diakses."
        )
      } finally {
        if (mounted) setLoadingRuangan(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  function toTimeSpan(value) {
    if (!value) return ""
    if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value
    return value
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError("")
    setSubmitSuccess("")

    if (!namaPeminjam || !namaRuangan || !keperluan || !tanggal || !jamMulai || !jamSelesai) {
      setSubmitError("Semua field wajib diisi.")
      return
    }

    const payload = {
      namaPeminjam,
      namaRuangan,
      keperluan,
      tanggalPeminjaman: tanggal,
      jamMulai: toTimeSpan(jamMulai),
      jamSelesai: toTimeSpan(jamSelesai),
    }

    try {
      setSubmitting(true)

     
      await api.post("/PeminjamanRuangan", payload)

      setSubmitSuccess("Pengajuan berhasil dikirim.")
      setNamaPeminjam("")
      setNamaRuangan("")
      setKeperluan("")
      setTanggal("")
      setJamMulai("")
      setJamSelesai("")
    } catch (err) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal membuat peminjaman. Cek backend (CORS/URL) dan payload DTO."
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Buat Peminjaman</CardTitle>
      </CardHeader>

      <CardContent>
        {errorRuangan ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorRuangan}
          </div>
        ) : null}

        {submitError ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        {submitSuccess ? (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {submitSuccess}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="text-sm font-medium">Nama Peminjam</div>
            <Input
              value={namaPeminjam}
              onChange={(e) => setNamaPeminjam(e.target.value)}
              placeholder="Contoh: Bagas"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Nama Ruangan</div>
            <Select
              value={namaRuangan}
              onValueChange={setNamaRuangan}
              disabled={loadingRuangan || !!errorRuangan}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingRuangan ? "Memuat ruangan..." : "Pilih ruangan tersedia"} />
              </SelectTrigger>
              <SelectContent>
                {ruangan.length === 0 ? (
                  <SelectItem value="__empty" disabled>
                    {loadingRuangan ? "Memuat..." : "Tidak ada ruangan tersedia"}
                  </SelectItem>
                ) : (
                  ruangan.map((r, idx) => {
                    const label = r.namaRuangan ?? r.nama ?? r.name ?? `Ruangan ${idx + 1}`
                    return (
                      <SelectItem key={r.id ?? r.ruanganId ?? idx} value={label}>
                        {label}
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">Sumber: GET /api/Ruangan/tersedia</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Keperluan</div>
            <Input
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              placeholder="Contoh: Praktikum"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
  <div className="space-y-2">
    <div className="text-sm font-medium">Tanggal</div>
    <Input
      type="date"
      value={tanggal}
      onChange={(e) => setTanggal(e.target.value)}
    />
    <div className="text-xs text-muted-foreground">
      Format otomatis YYYY-MM-DD
    </div>
  </div>

  <div className="space-y-2">
    <div className="text-sm font-medium">Jam Mulai</div>
    <Input
      type="time"
      value={jamMulai}
      onChange={(e) => setJamMulai(e.target.value)}
      step="60"
    />
    <div className="text-xs text-muted-foreground">
      Format otomatis HH:mm
    </div>
  </div>

  <div className="space-y-2">
    <div className="text-sm font-medium">Jam Selesai</div>
    <Input
      type="time"
      value={jamSelesai}
      onChange={(e) => setJamSelesai(e.target.value)}
      step="60"
    />
    <div className="text-xs text-muted-foreground">
      Format otomatis HH:mm
    </div>
  </div>
</div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Pengajuan"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">Endpoint: /api/PeminjamanRuangan</div>
        </form>
      </CardContent>
    </Card>
  )
}
