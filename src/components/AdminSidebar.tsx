"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth";
import { User } from "@/Types";

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

// Admin menu items
const adminMenuData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Content Management",
      url: "/admin/content",
      icon: BookOpen,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // User data for admin
  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar || "https://github.com/shadcn.png",
      }
    : {
        name: "Admin",
        email: "admin@studeehub.com",
        avatar: "https://github.com/shadcn.png",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with logo and title */}
      <SidebarHeader className="group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center justify-center min-w-[40px] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.PNG"
              alt="StudeeHub Logo"
              width={40}
              height={40}
              className="rounded transition-all duration-200 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 block"
            />
          </div>
          <span className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden transition-all duration-200">
            StudeeHub Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={adminMenuData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
