import { useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import Link from "@/components/core/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth/auth-client";
import { app } from "@/lib/config/app.config";
import { navLinks } from "@/lib/constants/nav-links";

const AppSidebar = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    await router.invalidate();
    await navigate({ to: "/" });
  };

  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <div className="font-medium text-lg group-data-[collapsible=icon]:hidden">
                <Link to="/" size="md" className="border-transparent focus-visible:border-primary">
                  <img src="/favicon.svg" alt={`${app.name} Logo`} className="size-5" />
                  {app.name}
                </Link>
              </div>

              <SidebarTrigger />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navLinks.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuLink
                  to={item.to}
                  data-active={item.to === router.state.location.pathname}
                  tooltip={item.label}
                >
                  <item.icon className="icon-sm" />
                  <span className="text-base">{item.label}</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton onClick={handleSignOut} tooltip="Logout">
          <LogOut className="icon-sm" />
          <span className="text-base">Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
