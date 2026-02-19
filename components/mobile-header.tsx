"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"
import {
  Users,
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Search,
  UserCircle,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface MobileHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: ["admin"] },
  { id: "directory", label: "Annuaire", icon: Users, roles: ["admin", "alumni"] },
  { id: "jobs", label: "Annonces", icon: Briefcase, roles: ["admin", "alumni"] },
  { id: "events", label: "Evenements", icon: CalendarDays, roles: ["admin", "alumni"] },
  { id: "logs", label: "Historique", icon: ClipboardList, roles: ["admin"] },
  { id: "search-alumni", label: "Rechercher", icon: Search, roles: ["alumni"] },
  { id: "my-profile", label: "Mon profil", icon: UserCircle, roles: ["alumni"] },
]

export function MobileHeader({ activeTab, onTabChange }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <header className="lg:hidden border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo-ecole-multimedia.svg"
            alt="Logo Ecole Multimedia"
            width={130}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Se deconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="px-3 pb-3">
          <div className="mb-2 px-3 py-2">
            <p className="text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role === "admin" ? "Administration" : "Espace Alumni"}
            </p>
          </div>
          <ul className="flex flex-col gap-1">
            {visibleItems.map((item) => (
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
