import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/30 p-4 gap-4">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <Navbar />
        <Card className="flex-1 overflow-y-auto rounded-xl border bg-card shadow-sm p-6">
          {children}
        </Card>
      </div>
    </div>
  );
}

