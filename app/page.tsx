"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { AlumniDirectory } from "@/components/alumni-directory"
import { JobBoard } from "@/components/job-board"
import { EventsModule } from "@/components/events-module"
import { LogsModule } from "@/components/logs-module"

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardOverview />}
            {activeTab === "directory" && <AlumniDirectory />}
            {activeTab === "jobs" && <JobBoard />}
            {activeTab === "events" && <EventsModule />}
            {activeTab === "logs" && <LogsModule />}
          </div>
        </main>
      </div>
    </div>
  )
}
