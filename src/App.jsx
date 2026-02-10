import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Alert } from "@mui/material";
import { getPeminjaman } from "./api/peminjaman";

export default function App() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getPeminjaman();

        // pastikan DataGrid punya id
        const normalized = data.map((x, idx) => ({
          id: x.id ?? idx + 1,
          ...x,
        }));

        setRows(normalized);
      } catch (e) {
        console.error(e);
        setError("Gagal mengambil data dari backend");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "status", headerName: "Status", width: 140 },
    { field: "namaRuangan", headerName: "Ruangan", flex: 1 },
    { field: "tanggal", headerName: "Tanggal", flex: 1 },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Daftar Peminjaman Ruangan
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>
    </Box>
  );
}
