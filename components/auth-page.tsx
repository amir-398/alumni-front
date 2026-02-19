"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import Image from "next/image"

export function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register state
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [regFirstName, setRegFirstName] = useState("")
  const [regLastName, setRegLastName] = useState("")
  const [regPromoYear, setRegPromoYear] = useState("")
  const [regDiploma, setRegDiploma] = useState("")

  const currentYear = new Date().getFullYear()
  const promoYears = Array.from({ length: 15 }, (_, i) => currentYear - i)
  const diplomas = [
    "Master Marketing Digital",
    "Master Finance",
    "Master Data Science",
    "Master Management",
    "Master RH",
    "Master Entrepreneuriat",
    "Bachelor Communication",
    "Bachelor Web",
  ]

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

  const handleRegister = (e: React.FormEvent) => {
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
      const result = register({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        promoYear: regPromoYear ? parseInt(regPromoYear) : undefined,
        diploma: regDiploma || undefined,
      })
      if (!result.success) {
        setError(result.error || "Erreur lors de l'inscription")
      }
      setLoading(false)
    }, 600)
  }

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode)
    setError("")
    setShowPassword(false)
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
            <CardTitle className="text-lg">
              {mode === "login" ? "Se connecter" : "Creer un compte"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Entrez vos identifiants pour acceder a la plateforme"
                : "Rejoignez le reseau alumni de l'Ecole Multimedia"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mode toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                onClick={() => switchMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Inscription
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Login form */}
            {mode === "login" && (
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
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>

                {/* Demo credentials */}
                <div className="rounded-lg bg-muted/70 p-4 text-xs text-muted-foreground mt-2">
                  <p className="font-semibold text-foreground mb-2">Comptes de demo :</p>
                  <div className="flex flex-col gap-1.5">
                    <p>
                      <span className="font-medium text-foreground">Admin :</span>{" "}
                      admin@ecole-multimedia.com / admin123
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Alumni :</span>{" "}
                      sophie.martin@email.com / alumni123
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* Register form */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                      autoComplete="given-name"
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
                      autoComplete="family-name"
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reg-promo">Promotion</Label>
                    <Select value={regPromoYear} onValueChange={setRegPromoYear}>
                      <SelectTrigger id="reg-promo" className="mt-1.5">
                        <SelectValue placeholder="Annee" />
                      </SelectTrigger>
                      <SelectContent>
                        {promoYears.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reg-diploma">Diplome</Label>
                    <Select value={regDiploma} onValueChange={setRegDiploma}>
                      <SelectTrigger id="reg-diploma" className="mt-1.5">
                        <SelectValue placeholder="Diplome" />
                      </SelectTrigger>
                      <SelectContent>
                        {diplomas.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
                  {loading ? "Inscription..." : "Creer mon compte"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Ecole Multimedia &mdash; Plateforme Alumni
        </p>
      </div>
    </div>
  )
}
