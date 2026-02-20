"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, LogIn, Shield, GraduationCap, Users, Crown } from "lucide-react"
import Image from "next/image"

export function AuthPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

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

        {/* Auth card */}
        <Card className="border border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Se connecter</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour acceder a la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Login form */}
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

            {/* Demo account buttons */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">
                Comptes de demo
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  disabled={loading}
                  onClick={() => handleDemoLogin("superadmin@ecole-multimedia.com", "super123")}
                >
                  <Crown className="w-4 h-4 text-chart-3" />
                  <span className="flex-1 text-left">Super Admin</span>
                  <span className="text-xs text-muted-foreground">superadmin@ecole-multimedia.com</span>
                </Button>
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

        <p className="text-center text-xs text-muted-foreground">
          Ecole Multimedia &mdash; Plateforme Alumni
        </p>
      </div>
    </div>
  )
}
