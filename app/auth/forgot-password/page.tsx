"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconBrain, IconMail } from "@tabler/icons-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { resetPassword, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await resetPassword(email)
    setSubmitted(true)
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
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-primary font-medium">Reset link sent!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check your email for instructions to reset your password
                </p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

