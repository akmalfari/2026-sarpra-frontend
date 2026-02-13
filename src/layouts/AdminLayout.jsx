import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function getTitle(pathname) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/ruangan")) return "Data Ruangan";
  if (pathname.startsWith("/admin/sarpras")) return "Data Sarpras";
  if (pathname.startsWith("/admin/gedung")) return "Data Gedung";

  return "SARPR A";
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="font-semibold">{title}</div>

          <div className="ml-auto">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => alert("TODO: logout")}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30 p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
