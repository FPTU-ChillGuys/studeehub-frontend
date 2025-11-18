"use client";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useProfile } from "@/hooks/useProfile";

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
      title: "Subscription Plans",
      url: "/admin/subscription-plans",
      icon: CreditCard,
    },
    {
      title: "Subscriptions",
      url: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      title: "Feedbacks",
      url: "/admin/feedbacks",
      icon: MessageSquare,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useProfile();

  const userData = user
    ? {
        name: user.fullName,
        email: user.email,
        avatar: user.profilePictureUrl || "", // Let AvatarFallback show initials if no image
      }
    : {
        name: "Admin",
        email: "admin@studeehub.com",
        avatar: "", // Let AvatarFallback show initials
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
