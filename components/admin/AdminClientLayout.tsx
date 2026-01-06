"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { AdminUser } from "@prisma/client";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "message" | "janaza" | "system";
  link?: string;
}

interface AdminClientLayoutProps {
  children: React.ReactNode;
  user: Partial<AdminUser> | null;
  notifications: NotificationItem[];
}

export function AdminClientLayout({
  children,
  user,
  notifications,
}: AdminClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          notifications={notifications}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
