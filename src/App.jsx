import { Routes, Route, Navigate } from "react-router-dom"

import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"

import Login from "./pages/Login/login.jsx"

import Dashboard from "./pages/admin/Dashboard.jsx"
import DataRuangan from "./pages/admin/DataRuangan.jsx"
import RiwayatPeminjaman from "./pages/admin/RiwayatPeminjaman.jsx"
import DetailPeminjaman from "./pages/admin/DetailPeminjaman.jsx"

import DashboardUser from "./pages/User/DashboardUser.jsx"
import CreatePeminjaman from "./pages/User/CreatePeminjaman.jsx"
import PeminjamanBerlangsung from "./pages/User/PeminjamanBerlangsung.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ruangan" element={<DataRuangan />} />
        <Route path="riwayat-peminjaman" element={<RiwayatPeminjaman />} />
        <Route path="detail/:id" element={<DetailPeminjaman />} />
      </Route>

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardUser />} />
        <Route path="create-peminjaman" element={<CreatePeminjaman />} />
        <Route path="peminjaman-berlangsung" element={<PeminjamanBerlangsung />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
    </Routes>
  )
}
