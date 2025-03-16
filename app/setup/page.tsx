"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconKey,
  IconBrain,
  IconCheck,
  IconAlertTriangle,
  IconServer,
  IconInfoCircle,
  IconSettings,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SetupStatus {
  configValid: boolean
  services: {
    supabase: boolean
    supabaseRequired: boolean
    openai: boolean
    openaiRequired: boolean
    epic: boolean
    epicRequired: boolean
    encryption: boolean
    encryptionRequired: boolean
  }
  missingRequired: string[]
  missingOptional: string[]
  allConfigured: boolean
  featureFlags: {
    requireSupabase: boolean
    requireOpenAI: boolean
    requireEpic: boolean
    requireEncryption: boolean
  }
}

export default function SetupPage() {
  const [apiKey, setApiKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check setup status on page load
    async function checkSetup() {
      try {
        const response = await fetch("/api/setup-check")
        if (response.ok) {
          const status = await response.json()
          setSetupStatus(status)
        } else {
          const errorText = await response.text()
          throw new Error(`Failed to check setup status: ${errorText}`)
        }
      } catch (error) {
        console.error("Setup check error:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        toast({
          title: "Setup Check Failed",
          description: "Could not verify environment configuration",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkSetup()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would store this securely
      // For this demo, we'll just simulate storing it
      localStorage.setItem("AGENT_2_API_KEY", apiKey)

      toast({
        title: "Success",
        description: "API key configured successfully",
      })

      // Redirect to chat page
      setTimeout(() => {
        router.push("/chat")
      }, 1500)
    } catch (error) {
      console.error("Error saving API key:", error)
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <IconServer className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <h2 className="text-xl font-medium mb-2">Checking Configuration</h2>
          <p className="text-muted-foreground">Verifying environment setup...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center text-destructive">Setup Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <IconAlertTriangle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription className="mt-2">
                <p>{error}</p>
                <p className="mt-2">Please check your server logs and environment variables.</p>
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()} className="w-full">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <CardTitle className="text-2xl text-center">AGENT 2.0 Setup</CardTitle>
            <CardDescription className="text-center">
              Configure your API key to start using the genomic analysis assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="setup" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              <TabsContent value="setup" className="mt-4">
                {setupStatus && setupStatus.missingRequired.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Missing Required Variables</AlertTitle>
                    <AlertDescription>
                      <p>The following environment variables are required:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {setupStatus.missingRequired.map((variable) => (
                          <li key={variable}>{variable}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="apiKey"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        OpenAI API Key
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <IconKey className="h-5 w-5" />
                        </div>
                        <input
                          id="apiKey"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="sk-..."
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored locally and never sent to our servers
                      </p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mr-2"
                      >
                        <IconKey className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <IconCheck className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Configuring..." : "Configure API Key"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="status" className="mt-4 space-y-4">
                {setupStatus && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <IconSettings className="h-4 w-4 mr-2" />
                        Service Status
                      </h3>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div
                          className={`p-3 rounded-md ${setupStatus.services.openai ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                        >
                          <div className="font-medium flex justify-between">
                            <span>OpenAI</span>
                            {setupStatus.services.openaiRequired && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <div
                            className={
                              setupStatus.services.openai
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                            }
                          >
                            {setupStatus.services.openai ? "Configured" : "Not Configured"}
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-md ${
                            setupStatus.services.supabase
                              ? "bg-green-100 dark:bg-green-900/30"
                              : setupStatus.services.supabaseRequired
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                          }`}
                        >
                          <div className="font-medium flex justify-between">
                            <span>Supabase</span>
                            {setupStatus.services.supabaseRequired ? (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                Required
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                          <div
                            className={
                              setupStatus.services.supabase
                                ? "text-green-700 dark:text-green-400"
                                : setupStatus.services.supabaseRequired
                                  ? "text-red-700 dark:text-red-400"
                                  : "text-yellow-700 dark:text-yellow-400"
                            }
                          >
                            {setupStatus.services.supabase
                              ? "Connected"
                              : setupStatus.services.supabaseRequired
                                ? "Not Connected (Required)"
                                : "Not Connected (Optional)"}
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-md ${
                            setupStatus.services.epic
                              ? "bg-green-100 dark:bg-green-900/30"
                              : setupStatus.services.epicRequired
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                          }`}
                        >
                          <div className="font-medium flex justify-between">
                            <span>Epic FHIR</span>
                            {setupStatus.services.epicRequired ? (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                Required
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                          <div
                            className={
                              setupStatus.services.epic
                                ? "text-green-700 dark:text-green-400"
                                : setupStatus.services.epicRequired
                                  ? "text-red-700 dark:text-red-400"
                                  : "text-yellow-700 dark:text-yellow-400"
                            }
                          >
                            {setupStatus.services.epic
                              ? "Configured"
                              : setupStatus.services.epicRequired
                                ? "Not Configured (Required)"
                                : "Not Configured (Optional)"}
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-md ${
                            setupStatus.services.encryption
                              ? "bg-green-100 dark:bg-green-900/30"
                              : setupStatus.services.encryptionRequired
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                          }`}
                        >
                          <div className="font-medium flex justify-between">
                            <span>Encryption</span>
                            {setupStatus.services.encryptionRequired ? (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                Required
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                          <div
                            className={
                              setupStatus.services.encryption
                                ? "text-green-700 dark:text-green-400"
                                : setupStatus.services.encryptionRequired
                                  ? "text-red-700 dark:text-red-400"
                                  : "text-yellow-700 dark:text-yellow-400"
                            }
                          >
                            {setupStatus.services.encryption
                              ? "Configured"
                              : setupStatus.services.encryptionRequired
                                ? "Not Configured (Required)"
                                : "Not Configured (Optional)"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {setupStatus.missingOptional.length > 0 && (
                      <Alert variant="warning" className="mt-4">
                        <IconInfoCircle className="h-4 w-4" />
                        <AlertTitle>Missing Optional Variables</AlertTitle>
                        <AlertDescription>
                          <p>The following optional environment variables are not set:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {setupStatus.missingOptional.map((variable) => (
                              <li key={variable}>{variable}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              AGENT 2.0 uses OpenAI's GPT-4o model for advanced genomic analysis
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

