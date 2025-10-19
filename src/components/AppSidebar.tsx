"use client";

import { Calendar, Home, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/features/auth/";
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

// Menu items.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Notebooks",
      url: "/user/my-documents",
      icon: BookOpen,
    },
    {
      title: "Learning Path",
      url: "#",
      icon: Calendar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  // Default user data if not logged in
  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.image || "https://github.com/shadcn.png",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "https://github.com/shadcn.png",
      };

  // Filter nav items based on user role
  const navItems =
    user?.role === "admin"
      ? data.navMain // Admin sees all items including Dashboard
      : data.navMain.filter((item) => item.title !== "Dashboard"); // Regular users don't see Dashboard

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
            StudeeHub
          </span>
        </div>
      </SidebarHeader>

      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
