import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, DoorOpen, Package, PlusSquare, List } from "lucide-react"

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
} from "@/components/ui/sidebar"

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
} from "@/components/ui/alert-dialog"

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "DataPeminjaman", url: "/admin/peminjaman", icon: DoorOpen },
  { title: "Riwayat Peminjaman", url: "/admin/riwayat-peminjaman", icon: Package },
  { title: "Create Ruangan", url: "/admin/create-ruangan", icon: PlusSquare },
  { title: "Data Ruangan", url: "/admin/data-ruangan", icon: List },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center font-bold">
            S
          </div>
          <div className="leading-tight">
            <div className="font-semibold">SARPRA Admin</div>
            <div className="text-xs text-muted-foreground">Manajemen</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const active =
                  pathname === item.url ||
                  (item.url !== "/admin/dashboard" && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Logout
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will log you out from the admin panel.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      localStorage.removeItem("token")
                      navigate("/login", { replace: true })
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
