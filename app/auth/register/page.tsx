"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconBrain, IconLock, IconMail, IconUser } from "@tabler/icons-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeHipaa, setAgreeHipaa] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { signUp, loading } = useAuth()

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number"
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      return "Password must contain at least one special character"
    }
    return ""
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordError(validatePassword(newPassword))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (!agreeTerms || !agreeHipaa) {
      return
    }

    const error = validatePassword(password)
    if (error) {
      setPasswordError(error)
      return
    }

    await signUp(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <IconBrain className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register to access AGENT 2.0 genomic analysis platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IconUser className="h-5 w-5" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IconMail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IconLock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IconLock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hipaa"
                    checked={agreeHipaa}
                    onCheckedChange={(checked) => setAgreeHipaa(checked as boolean)}
                    required
                  />
                  <Label htmlFor="hipaa" className="text-sm">
                    I understand that this platform handles sensitive health information and agree to comply with{" "}
                    <Link href="/hipaa" className="text-primary hover:underline">
                      HIPAA regulations
                    </Link>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !agreeTerms || !agreeHipaa || password !== confirmPassword || !!passwordError}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

