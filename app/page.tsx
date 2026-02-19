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
import { LogsModule } from "@/components/logs-module"
import { AlumniMyProfile } from "@/components/alumni-my-profile"
import { AlumniSearch } from "@/components/alumni-search"

export default function Page() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState("")

  // Set default tab based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        setActiveTab("dashboard")
      } else {
        setActiveTab("directory")
      }
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return <AuthPage />
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Admin views */}
            {isAdmin && activeTab === "dashboard" && <DashboardOverview />}
            {isAdmin && activeTab === "directory" && <AlumniDirectory />}
            {isAdmin && activeTab === "logs" && <LogsModule />}

            {/* Alumni views */}
            {!isAdmin && activeTab === "directory" && <AlumniSearch />}
            {!isAdmin && activeTab === "search-alumni" && <AlumniSearch />}
            {!isAdmin && activeTab === "my-profile" && <AlumniMyProfile />}

            {/* Shared views */}
            {activeTab === "jobs" && <JobBoard />}
            {activeTab === "events" && <EventsModule />}
          </div>
        </main>
      </div>
    </div>
  )
}
