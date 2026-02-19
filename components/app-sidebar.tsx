"use client"

import { cn } from "@/lib/utils"
import {
  Users,
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  ClipboardList,
  GraduationCap,
} from "lucide-react"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "directory", label: "Annuaire", icon: Users },
  { id: "jobs", label: "Annonces", icon: Briefcase },
  { id: "events", label: "Evenements", icon: CalendarDays },
  { id: "logs", label: "Historique", icon: ClipboardList },
]

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-sidebar-foreground">Alumni Hub</h1>
          <p className="text-xs text-sidebar-foreground/60">Espace Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin Principal</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@ecole.fr</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
