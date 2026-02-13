import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login.jsx"

import AdminLayout from "./layouts/AdminLayout.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import DataRuangan from "./pages/admin/DataRuangan.jsx";
import RiwayatPeminjaman from "./pages/admin/RiwayatPeminjaman.jsx";
import DetailPeminjaman from "./pages/admin/DetailPeminjaman.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
       <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ruangan" element={<DataRuangan />} />
        <Route path="riwayat-peminjaman" element={<RiwayatPeminjaman />} />
       <Route path="detail/:id" element={<DetailPeminjaman />} />

      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
    </Routes>
  );
}
