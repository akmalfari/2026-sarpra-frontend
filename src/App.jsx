import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"

import Login from "./pages/Login/login"

import Dashboard from "./pages/admin/Dashboard"
import DataRuangan from "./pages/admin/DataRuangan"
import DetailPeminjaman from "./pages/admin/DetailPeminjaman"
import RiwayatPeminjaman from "./pages/admin/RiwayatPeminjaman"

import DashboardUser from "./pages/User/DashboardUser"
import CreatePeminjaman from "./pages/User/CreatePeminjaman"
import PeminjamanBerlangsung from "./pages/User/PeminjamanBerlangsung"
import RuanganTersedia from "./pages/User/RuanganTersedia"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ruangan" element={<DataRuangan />} />
        <Route path="riwayat-peminjaman" element={<RiwayatPeminjaman />} />
        <Route path="detail/:id" element={<DetailPeminjaman />} />
      </Route>

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardUser />} />
        <Route path="buat-peminjaman" element={<CreatePeminjaman />} />
        <Route path="peminjaman-berlangsung" element={<PeminjamanBerlangsung />} />
        <Route path="ruangan-tersedia" element={<RuanganTersedia />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
    </Routes>
  )
}
