"use client";

import { Calendar, Home, Origami, BookOpen } from "lucide-react";

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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Notebooks",
      url: "/dashboard/my-documents",
      icon: BookOpen,
    },
    {
      title: "Flashcards",
      url: "#",
      icon: Origami,
    },
    {
      title: "Learning Path",
      url: "#",
      icon: Calendar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
