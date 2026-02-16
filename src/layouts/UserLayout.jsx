import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarUser } from "@/components/app-sidebar-user";

export default function UserLayout() {
  return (
    <SidebarProvider>
      <AppSidebarUser />
      <SidebarInset className="p-6">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
