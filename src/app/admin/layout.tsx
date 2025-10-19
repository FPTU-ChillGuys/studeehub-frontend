"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AuthGuard } from "@/components/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <AdminSidebar />
        {children}
      </SidebarProvider>
    </AuthGuard>
  );
}
