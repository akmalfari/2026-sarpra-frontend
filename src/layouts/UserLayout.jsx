import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import UserSidebar from "@/components/app-sidebar-user"

export default function UserLayout() {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <div className="min-h-screen">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
