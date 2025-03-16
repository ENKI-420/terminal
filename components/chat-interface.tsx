"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { processGenomicFile } from "@/utils/fileUploadApi"
import { IconSend, IconUpload, IconFileText, IconBrain, IconX, IconRefresh } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export function ChatInterface() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<File | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput, reload, stop, setMessages } =
    useChat({
      api: "/api/chat",
      onFinish: () => {
        scrollToBottom()
      },
      onError: (error) => {
        console.error("Chat error:", error)
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again later.",
          variant: "destructive",
        })
      },
    })

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleClearChat = () => {
    setMessages([])
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    })
  }

  const handleRefreshConnection = () => {
    if (isLoading) {
      stop()
      toast({
        title: "Request stopped",
        description: "The current AI response has been stopped.",
      })
    } else {
      reload()
      toast({
        title: "Connection refreshed",
        description: "The AI connection has been refreshed.",
      })
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setFilePreview(file)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      // Process the file
      const analysisResult = await processGenomicFile(file)

      clearInterval(interval)
      setUploadProgress(100)

      // Add file upload message from user
      append({
        id: Date.now().toString(),
        content: `Uploaded file: ${file.name} for analysis`,
        role: "user",
      })

      // Add AI response with analysis
      append({
        id: (Date.now() + 1).toString(),
        content: analysisResult,
        role: "assistant",
      })

      setFilePreview(null)
      setUploadProgress(0)
      setIsUploading(false)

      toast({
        title: "File analyzed",
        description: `Successfully analyzed ${file.name}`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      setUploadProgress(0)

      // Add error message
      append({
        id: Date.now().toString(),
        content: `Error analyzing file: ${file.name}. Please try again.`,
        role: "assistant",
      })

      toast({
        title: "Error",
        description: `Failed to analyze ${file.name}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleFetchBeakerReports = async () => {
    setIsUploading(true)

    try {
      // For demo purposes, we'll use a mock patient ID
      const patientId = "patient-001"

      // Add user message
      append({
        id: Date.now().toString(),
        content: `Fetching laboratory reports for patient ${patientId}`,
        role: "user",
      })

      // Fetch Beaker laboratory reports from our Epic FHIR API
      const response = await fetch(`/api/epic/beaker-reports?patientId=${patientId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const reports = data.reports || []

      // Format the reports for display
      let reportsContent = "## Laboratory Reports\n\n"

      if (reports.length === 0) {
        reportsContent += "No laboratory reports found for this patient."
      } else {
        reportsContent += `Found ${reports.length} reports:\n\n`

        reports.forEach((report, index) => {
          const reportName = report.code?.text || "Laboratory Report"
          const reportDate = new Date(report.effectiveDateTime || report.issued || "").toLocaleString()
          const status = report.status || "Unknown"

          reportsContent += `### ${index + 1}. ${reportName}\n`
          reportsContent += `- **Date**: ${reportDate}\n`
          reportsContent += `- **Status**: ${status}\n`

          if (report.result && report.result.length > 0) {
            reportsContent += `- **Results**:\n`
            report.result.forEach((result) => {
              const resultName = result.code?.text || "Unknown Test"
              const resultValue = result.valueQuantity?.value || result.valueString || "N/A"
              const unit = result.valueQuantity?.unit || ""
              const interpretation = result.interpretation?.[0]?.text || "Normal"
              const isAbnormal = interpretation.toLowerCase() !== "normal"
              const abnormalFlag = isAbnormal ? " ⚠️" : ""

              reportsContent += `  - ${resultName}: ${resultValue} ${unit}${abnormalFlag} (${interpretation})\n`
            })
          }

          if (report.conclusion) {
            reportsContent += `- **Conclusion**: ${report.conclusion}\n`
          }

          reportsContent += "\n"
        })
      }

      // Add AI response with the reports
      append({
        id: (Date.now() + 1).toString(),
        content: reportsContent,
        role: "assistant",
      })

      toast({
        title: "Reports fetched",
        description: `Successfully retrieved ${reports.length} reports`,
      })
    } catch (error) {
      console.error("Error fetching reports:", error)

      // Add error message
      append({
        id: Date.now().toString(),
        content: `Error fetching laboratory reports. Please try again.`,
        role: "assistant",
      })

      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const cancelFileUpload = () => {
    setFilePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    toast({
      title: "Upload cancelled",
      description: "File upload has been cancelled.",
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <Card className="flex flex-col h-[80vh] w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <IconBrain className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-lg font-semibold">AGENT 2.0 Chat</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            Clear Chat
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshConnection}>
            <IconRefresh className="h-4 w-4 mr-1" />
            {isLoading ? "Stop" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <IconBrain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to AGENT 2.0</h2>
            <p className="text-muted-foreground mb-4">AI-powered genomic analysis assistant for oncology research</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Ask Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Inquire about genomic markers, cancer research, or treatment options
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Upload Files</h3>
                <p className="text-sm text-muted-foreground">Analyze genomic data files (CSV, FASTA, TXT, PDF)</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div
                className="prose dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Preview Area */}
      {filePreview && (
        <div className="px-4 py-2 bg-card border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <IconFileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{filePreview.name}</p>
                <p className="text-xs text-muted-foreground">{(filePreview.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={cancelFileUpload} className="text-muted-foreground hover:text-foreground">
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Analyzing file...</p>
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2 mb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".csv,.txt,.fasta,.vcf,.pdf,.json"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
          >
            <IconUpload className="h-4 w-4 mr-1" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" onClick={handleFetchBeakerReports} disabled={isUploading || isLoading}>
            <IconFileText className="h-4 w-4 mr-1" />
            Fetch Lab Reports
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading || isUploading}
          />
          <Button type="submit" disabled={isLoading || isUploading || !input.trim()}>
            <IconSend className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

// Helper function to format messages with markdown
function formatMessage(content: string): string {
  // Simple markdown to HTML conversion
  // In a real app, you'd use a proper markdown library
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/- (.*?)$/gm, "• $1<br>")
}

