"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Edit3, X, UserCircle } from "lucide-react"

export function StaffProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    specialite: "React / Next.js",
  })
  const [savedData, setSavedData] = useState({ ...editData })

  const handleSave = () => {
    setSavedData({ ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({ ...savedData })
    setIsEditing(false)
  }

  const displayData = isEditing ? editData : savedData

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mon profil</h2>
          <p className="text-sm text-muted-foreground">Gerez vos informations de staff</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit3 className="w-4 h-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
              <X className="w-4 h-4" />
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>
        )}
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {displayData.firstName} {displayData.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">Staff</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="staff-firstname" className="text-muted-foreground text-xs uppercase tracking-wider">
                Prenom
              </Label>
              {isEditing ? (
                <Input
                  id="staff-firstname"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="mt-1.5"
                />
              ) : (
                <p className="text-sm font-medium text-foreground mt-1.5">{displayData.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="staff-lastname" className="text-muted-foreground text-xs uppercase tracking-wider">
                Nom
              </Label>
              {isEditing ? (
                <Input
                  id="staff-lastname"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="mt-1.5"
                />
              ) : (
                <p className="text-sm font-medium text-foreground mt-1.5">{displayData.lastName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="staff-specialite" className="text-muted-foreground text-xs uppercase tracking-wider">
                Specialite
              </Label>
              {isEditing ? (
                <Input
                  id="staff-specialite"
                  value={editData.specialite}
                  onChange={(e) => setEditData({ ...editData, specialite: e.target.value })}
                  className="mt-1.5"
                  placeholder="Ex: React / Next.js"
                />
              ) : (
                <p className="text-sm font-medium text-foreground mt-1.5">{displayData.specialite}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
