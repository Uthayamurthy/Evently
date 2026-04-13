import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User2, Calendar, ShieldCheck, ChevronUp, LogOut } from "lucide-react"
import { useAuth } from "@/AuthContext"
import { Link, useLocation } from "react-router-dom"

export function FacultyLayout({ children }: { children: React.ReactNode }) {
  const { userName, role, logout } = useAuth()
  const location = useLocation()

  return (
    <SidebarProvider>
      <Sidebar className="border-r shadow-sm">
        <SidebarHeader className="p-4 flex items-center justify-center border-b">
           <h1 className="text-xl font-bold flex items-center gap-2 text-blue-600"><Calendar className="text-blue-500"/> Evently</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Faculty Controls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/faculty/dashboard'}
                  >
                    <Link to="/faculty/dashboard" className="flex items-center gap-2 w-full">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Pending ODs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/faculty/records'}
                  >
                    <Link to="/faculty/records" className="flex items-center gap-2 w-full">
                      <Calendar className="h-4 w-4" />
                      <span>OD Records</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-3 w-full"
                    >
                      <Avatar className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center">
                        <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 font-bold">
                           {userName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground capitalize">{role?.toLowerCase()}</span>
                      </div>
                      <ChevronUp className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 w-full bg-slate-50 relative h-[100dvh] overflow-y-auto">
        <div className="absolute top-4 left-4 z-50 md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
