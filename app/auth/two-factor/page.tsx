import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dna } from "@/components/icons/dna"

export const metadata: Metadata = {
  title: "Two-Factor Authentication | GenomicInsights",
  description: "Verify your identity with two-factor authentication",
}

export default function TwoFactorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex items-center justify-center rounded-full bg-primary p-2">
            <Dna className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">Enter the code sent to your device</p>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Verification Code</CardTitle>
            <CardDescription>We've sent a 6-digit code to your registered device</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Input
                  key={i}
                  className="h-12 text-center text-lg"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive a code?</p>
              <Button variant="link" className="p-0 h-auto">
                Resend code
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">Verify</Button>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
