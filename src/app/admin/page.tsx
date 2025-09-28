'use client'

import { AdminDashboard } from "@/app/components/AdminDashboard";

export default function AdminPage() {
  const handleViewProject = (lead: any) => {
    // Handle project viewing logic
    console.log('Viewing project:', lead);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard onViewProject={handleViewProject} />
    </div>
  );
}
