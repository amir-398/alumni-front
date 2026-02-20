"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, LogIn, Shield, GraduationCap, Users, Crown, UserPlus } from "lucide-react"
import Image from "next/image"

export function AuthPage() {
  const { login, registerSuperAdmin, hasSuperAdmin, superAdminEmail, superAdminPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register super admin fields
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [regFirstName, setRegFirstName] = useState("")
  const [regLastName, setRegLastName] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setTimeout(() => {
      const result = login(loginEmail, loginPassword)
      if (!result.success) {
        setError(result.error || "Erreur de connexion")
      }
      setLoading(false)
    }, 600)
  }

  const handleRegisterSuperAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (regPassword !== regConfirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    if (regPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const result = registerSuperAdmin({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
      })
      if (!result.success) {
        setError(result.error || "Erreur lors de l'inscription")
      }
      setLoading(false)
    }, 600)
  }

  const handleDemoLogin = (email: string, password: string) => {
    setError("")
    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      if (!result.success) {
        setError(result.error || "Erreur de connexion")
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Logo header */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/logo-ecole-multimedia.svg"
            alt="Logo Ecole Multimedia"
            width={220}
            height={60}
            className="h-14 w-auto"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Alumni Hub</h1>
            <p className="text-sm text-muted-foreground">
              Reseau des anciens de l&apos;Ecole Multimedia
            </p>
          </div>
        </div>

        {!hasSuperAdmin ? (
          /* ===== FIRST TIME SETUP: Register Super Admin ===== */
          <Card className="border border-border shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Configuration initiale</CardTitle>
              <CardDescription>
                Creez le compte Super Administrateur pour commencer a utiliser la plateforme.
                Ce compte pourra ensuite inviter les membres du staff et gerer les alumni.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSuperAdmin} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reg-firstname">Prenom</Label>
                    <Input
                      id="reg-firstname"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Prenom"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-lastname">Nom</Label>
                    <Input
                      id="reg-lastname"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Nom"
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="mt-1.5"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Mot de passe</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 caracteres"
                      required
                      className="pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    required
                    className="mt-1.5"
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? "Creation en cours..." : "Creer le compte Super Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* ===== NORMAL LOGIN (super admin already exists) ===== */
          <Card className="border border-border shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Se connecter</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour acceder a la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="mt-1.5"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      required
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              {/* Demo accounts */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">
                  Comptes de demo
                </p>
                <div className="flex flex-col gap-2">
                  {superAdminEmail && superAdminPassword && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      disabled={loading}
                      onClick={() => handleDemoLogin(superAdminEmail, superAdminPassword)}
                    >
                      <Crown className="w-4 h-4 text-chart-3" />
                      <span className="flex-1 text-left">Super Admin</span>
                      <span className="text-xs text-muted-foreground">{superAdminEmail}</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    disabled={loading}
                    onClick={() => handleDemoLogin("admin@ecole-multimedia.com", "admin123")}
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="flex-1 text-left">Admin</span>
                    <span className="text-xs text-muted-foreground">admin@ecole-multimedia.com</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    disabled={loading}
                    onClick={() => handleDemoLogin("sophie.martin@email.com", "alumni123")}
                  >
                    <GraduationCap className="w-4 h-4 text-accent" />
                    <span className="flex-1 text-left">Alumni</span>
                    <span className="text-xs text-muted-foreground">sophie.martin@email.com</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    disabled={loading}
                    onClick={() => handleDemoLogin("staff@ecole-multimedia.com", "staff123")}
                  >
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-left">Staff</span>
                    <span className="text-xs text-muted-foreground">staff@ecole-multimedia.com</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Ecole Multimedia &mdash; Plateforme Alumni
        </p>
      </div>
    </div>
  )
}
