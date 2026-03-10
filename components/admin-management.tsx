"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { UserPlus, Mail, CheckCircle, Clock, UserCircle, ShieldCheck } from "lucide-react"

export function AdminManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [invited, setInvited] = useState(false)
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const refreshAdmins = async () => {
    setLoading(true)
    try {
      const { adminApi } = await import("@/lib/api/admin")
      const res = await adminApi.getAlumni({ limit: 100 }) as any
      const adminList = res.items
        .filter((u: any) => u.role === "ADMIN")
        .map((u: any) => ({
          id: u.id,
          email: u.email,
          firstName: u.profile?.first_name || "",
          lastName: u.profile?.last_name || "",
          status: u.is_verified ? "active" : "invited",
          invitedAt: u.last_login || u.id
        }))
      setAdmins(adminList)
    } catch (err) {
      console.error("Failed to load admins", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAdmins()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { adminApi } = await import("@/lib/api/admin")
      await adminApi.createAlumni({
        email: inviteEmail,
        first_name: inviteFirstName,
        last_name: inviteLastName,
        role: "ADMIN"
      })
      setInvited(true)
      refreshAdmins()
      setTimeout(() => {
        setDialogOpen(false)
        setInvited(false)
        setInviteEmail("")
        setInviteFirstName("")
        setInviteLastName("")
      }, 1500)
    } catch (err) {
      console.error("Failed to invite admin", err)
      alert("Erreur lors de l'invitation. Verifiez si l'email existe deja.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestion des Administrateurs</h2>
          <p className="text-sm text-muted-foreground">Gerez les administrateurs de la plateforme</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setInvited(false) } }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90">
              <ShieldCheck className="w-4 h-4" />
              Ajouter un Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Inviter un administrateur</DialogTitle>
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
                <p className="text-foreground font-medium">Invitation Admin envoyee</p>
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
          <CardTitle className="text-base">Administrateurs ({admins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Membre</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
                          {member.firstName ? (
                            <span className="text-xs font-semibold text-sidebar-primary">
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
