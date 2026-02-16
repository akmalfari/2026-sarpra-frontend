import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRuangan } from "@/api/AdminaRuangan";

export default function CreateRuangan() {
  const [namaRuangan, setNamaRuangan] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");
  const [status, setStatus] = React.useState("tersedia");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!namaRuangan.trim() || !keterangan.trim() || !status) {
      setError("Semua field wajib diisi.");
      return;
    }

    const payload = {
      namaRuangan: namaRuangan.trim(),
      keterangan: keterangan.trim(),
      status,
    };

    try {
      setSubmitting(true);
      await createRuangan(payload);
      setSuccess("Ruangan berhasil dibuat.");
      setNamaRuangan("");
      setKeterangan("");
      setStatus("tersedia");
    } catch (err) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal membuat ruangan.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create Ruangan</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="text-sm font-medium">Nama Ruangan</div>
            <Input
              value={namaRuangan}
              onChange={(e) => setNamaRuangan(e.target.value)}
              placeholder="Contoh: Lab Komputer 1"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Keterangan</div>
            <Input
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Untuk praktikum"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Status</div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tersedia">tersedia</SelectItem>
                <SelectItem value="maintenance">maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Ruangan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
