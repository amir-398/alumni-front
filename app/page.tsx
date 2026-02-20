"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth-page"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { AlumniDirectory } from "@/components/alumni-directory"
import { JobBoard } from "@/components/job-board"
import { EventsModule } from "@/components/events-module"
import { AlumniMyProfile } from "@/components/alumni-my-profile"
import { StaffProfile } from "@/components/staff-profile"
import { StaffManagement } from "@/components/staff-management"

export default function Page() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "super_admin" || user.role === "admin" || user.role === "staff") {
        setActiveTab("dashboard")
      } else {
        setActiveTab("jobs")
      }
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return <AuthPage />
  }

  const role = user?.role
  const isAdminLike = role === "super_admin" || role === "admin"

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Admin, Super Admin & Staff views */}
            {(isAdminLike || role === "staff") && activeTab === "dashboard" && <DashboardOverview />}
            {(isAdminLike || role === "staff") && activeTab === "directory" && <AlumniDirectory />}

            {/* Super Admin only */}
            {role === "super_admin" && activeTab === "staff-management" && <StaffManagement />}

            {/* Alumni views */}
            {role === "alumni" && activeTab === "my-profile" && <AlumniMyProfile />}

            {/* Staff profile */}
            {role === "staff" && activeTab === "my-profile" && <StaffProfile />}

            {/* Shared views */}
            {activeTab === "jobs" && <JobBoard />}
            {activeTab === "events" && <EventsModule />}
          </div>
        </main>
      </div>
    </div>
  )
}
