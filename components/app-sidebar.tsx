"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"
import {
  Users,
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  LogOut,
  UserCircle,
  UserPlus,
} from "lucide-react"
import Image from "next/image"

interface AppSidebarProps {
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
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: ["super_admin", "admin", "staff"] },
  { id: "directory", label: "Annuaire", icon: Users, roles: ["super_admin", "admin", "staff"] },
  { id: "jobs", label: "Annonces", icon: Briefcase, roles: ["super_admin", "admin", "alumni", "staff"] },
  { id: "events", label: "Evenements", icon: CalendarDays, roles: ["super_admin", "admin", "alumni", "staff"] },
  { id: "staff-management", label: "Gestion Staff", icon: UserPlus, roles: ["super_admin"] },
  { id: "my-profile", label: "Mon profil", icon: UserCircle, roles: ["alumni", "staff"] },
]

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { user, logout } = useAuth()

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <Image
          src="/images/logo-ecole-multimedia.svg"
          alt="Logo Ecole Multimedia"
          width={160}
          height={44}
          className="h-9 w-auto brightness-0 invert"
          priority
        />
      </div>

      {/* Role badge */}
      <div className="px-5 pt-4 pb-2">
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          user?.role === "super_admin" || user?.role === "admin"
            ? "bg-sidebar-primary/20 text-sidebar-primary"
            : "bg-sidebar-accent text-sidebar-accent-foreground"
        )}>
          {user?.role === "super_admin" ? "Super Admin" : user?.role === "admin" ? "Administration" : user?.role === "staff" ? "Staff" : "Espace Alumni"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {visibleItems.map((item) => (
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

      {/* User footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
            aria-label="Se deconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
