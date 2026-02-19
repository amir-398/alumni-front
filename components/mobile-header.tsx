"use client"

import { cn } from "@/lib/utils"
import {
  Users,
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

interface MobileHeaderProps {
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

export function MobileHeader({ activeTab, onTabChange }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="lg:hidden border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-semibold text-foreground">Alumni Hub</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="px-3 pb-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onTabChange(item.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
