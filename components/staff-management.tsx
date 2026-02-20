"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserPlus, Mail, CheckCircle, Clock, UserCircle } from "lucide-react"

interface StaffMember {
  id: string
  email: string
  firstName: string
  lastName: string
  module: string
  specialite: string
  status: "active" | "invited"
  invitedAt: string
}

const mockStaff: StaffMember[] = [
  {
    id: "staff-1",
    email: "staff@ecole-multimedia.com",
    firstName: "Julie",
    lastName: "Moreau",
    module: "Developpement Web",
    specialite: "React / Next.js",
    status: "active",
    invitedAt: "2025-09-01",
  },
  {
    id: "staff-2",
    email: "marc.dubois@ecole-multimedia.com",
    firstName: "Marc",
    lastName: "Dubois",
    module: "Design UX/UI",
    specialite: "Figma / Design System",
    status: "active",
    invitedAt: "2025-10-15",
  },
  {
    id: "staff-3",
    email: "sarah.nguyen@ecole-multimedia.com",
    firstName: "",
    lastName: "",
    module: "",
    specialite: "",
    status: "invited",
    invitedAt: "2026-02-18",
  },
]

export function StaffManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [inviteModule, setInviteModule] = useState("")
  const [inviteSpecialite, setInviteSpecialite] = useState("")
  const [invited, setInvited] = useState(false)
  const [staff, setStaff] = useState(mockStaff)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      email: inviteEmail,
      firstName: inviteFirstName,
      lastName: inviteLastName,
      module: inviteModule,
      specialite: inviteSpecialite,
      status: "invited",
      invitedAt: new Date().toISOString().split("T")[0],
    }
    setStaff([...staff, newMember])
    setInvited(true)
    setTimeout(() => {
      setDialogOpen(false)
      setInvited(false)
      setInviteEmail("")
      setInviteFirstName("")
      setInviteLastName("")
      setInviteModule("")
      setInviteSpecialite("")
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestion du Staff</h2>
          <p className="text-sm text-muted-foreground">Invitez et gerez les membres du staff</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setInvited(false) } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Inviter un staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Inviter un membre du staff</DialogTitle>
            </DialogHeader>
            {!invited ? (
              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="invite-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="prenom.nom@ecole-multimedia.com"
                    required
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Un email d&apos;invitation sera envoye a cette adresse
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invite-firstname">Prenom</Label>
                    <Input
                      id="invite-firstname"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      placeholder="Optionnel"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-lastname">Nom</Label>
                    <Input
                      id="invite-lastname"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      placeholder="Optionnel"
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invite-module">Module</Label>
                    <Input
                      id="invite-module"
                      value={inviteModule}
                      onChange={(e) => setInviteModule(e.target.value)}
                      placeholder="Optionnel"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-specialite">Specialite</Label>
                    <Input
                      id="invite-specialite"
                      value={inviteSpecialite}
                      onChange={(e) => setInviteSpecialite(e.target.value)}
                      placeholder="Optionnel"
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={!inviteEmail.trim()} className="gap-2">
                    <Mail className="w-4 h-4" />
                    Envoyer l&apos;invitation
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle className="w-12 h-12 text-accent" />
                <p className="text-foreground font-medium">Invitation envoyee</p>
                <p className="text-sm text-muted-foreground text-center">
                  Un email d&apos;invitation a ete envoye a <span className="font-medium">{inviteEmail}</span>
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">Membres du staff ({staff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Membre</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Module</TableHead>
                  <TableHead className="font-semibold">Specialite</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.firstName ? (
                            <span className="text-xs font-semibold text-primary">
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                          ) : (
                            <UserCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {member.firstName && member.lastName
                            ? `${member.firstName} ${member.lastName}`
                            : "En attente"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.module || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.specialite || "-"}
                    </TableCell>
                    <TableCell>
                      {member.status === "active" ? (
                        <Badge className="bg-accent/15 text-accent border border-accent/30 text-xs gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge className="bg-chart-3/15 text-chart-3 border border-chart-3/30 text-xs gap-1">
                          <Clock className="w-3 h-3" />
                          Invite
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
