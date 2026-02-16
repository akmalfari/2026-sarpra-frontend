import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Clock, DoorOpen, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const navItems = [
  { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
  { title: "Buat Peminjaman", url: "/user/buat-peminjaman", icon: PlusCircle },
  { title: "Peminjaman Berlangsung", url: "/user/peminjaman-berlangsung", icon: Clock },
  { title: "Ruangan Tersedia", url: "/user/ruangan-tersedia", icon: DoorOpen },
];

export function AppSidebarUser() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-semibold">
            U
          </div>
          <div className="leading-tight">
            <div className="font-semibold">SARPRA User</div>
            <div className="text-xs text-muted-foreground">Peminjaman</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout?</AlertDialogTitle>
              <AlertDialogDescription>Kamu yakin ingin keluar?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Ya, logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
