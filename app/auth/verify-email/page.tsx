import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna } from "@/components/icons/dna"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Verify Email | GenomicInsights",
  description: "Verify your email address",
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex items-center justify-center rounded-full bg-primary p-2">
            <Dna className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Verify Your Email</h1>
          <p className="text-sm text-muted-foreground">Check your inbox for a verification link</p>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-xl text-center">Email Sent</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>If you don't see the email, check your spam folder or</p>
              <Button variant="link" className="p-0 h-auto">
                click here to resend
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
