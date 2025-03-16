"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useChat } from "ai/react"
import {
  IconSend,
  IconMicrophone,
  IconUpload,
  IconBrain,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconDna,
  IconFlask,
  IconFileText,
  IconCommand,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useChatStore } from "@/store/chat-store"
import { processGenomicFile } from "@/utils/fileUploadApi"
import { generateQuickReplySuggestions } from "@/utils/chatbotApi"
import { SecurityBadge } from "@/components/ui/security-badge"
import { cn } from "@/lib/utils"

export function ChatInterfacePro() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<File | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const controls = useAnimation()

  // Simulate voice recognition
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      // Simulate voice input result
      setInput(input + " genomic analysis of EGFR mutations")
    } else {
      setIsListening(true)
      toast({
        title: "Voice Recognition Active",
        description: "Speak clearly into your microphone",
      })
      // Simulate listening for 3 seconds
      setTimeout(() => {
        setIsListening(false)
        setInput(input + " genomic analysis of EGFR mutations")
      }, 3000)
    }
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput, reload, stop, setMessages } =
    useChat({
      api: "/api/chat",
      onFinish: () => {
        scrollToBottom()
        // Generate suggestions based on the AI's response
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          const newSuggestions = generateQuickReplySuggestions(lastMessage.content)
          setSuggestions(newSuggestions)
        }
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

  const setIsAnalyzing = useChatStore((state) => state.setIsAnalyzing)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    } else {
      // Keep typing indicator for a short time after response is received
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Pulse animation for the brain icon
  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    })
  }, [controls])

  const handleClearChat = () => {
    setMessages([])
    setSuggestions([])
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
    setIsAnalyzing(true)

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

      // Process the genomic file
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
      setIsAnalyzing(false)

      toast({
        title: "File analyzed",
        description: `Successfully analyzed ${file.name}`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      setUploadProgress(0)
      setIsAnalyzing(false)

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const cancelFileUpload = () => {
    setFilePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    toast({
      title: "Upload cancelled",
      description: "File upload has been cancelled.",
    })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setSuggestions([])
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleVisualization = () => {
    setIsVisualizationOpen(!isVisualizationOpen)
  }

  // Command palette functionality
  const commands = [
    { id: "clear", name: "Clear chat", action: handleClearChat },
    { id: "upload", name: "Upload genomic file", action: () => fileInputRef.current?.click() },
    { id: "egfr", name: "Analyze EGFR mutations", action: () => setInput("Analyze EGFR mutations in lung cancer") },
    {
      id: "brca",
      name: "Analyze BRCA mutations",
      action: () => setInput("Explain BRCA1/2 mutations in breast cancer"),
    },
    {
      id: "kras",
      name: "Analyze KRAS mutations",
      action: () => setInput("What are the implications of KRAS G12C mutations?"),
    },
    { id: "fullscreen", name: "Toggle fullscreen", action: toggleFullscreen },
    { id: "visualization", name: "Toggle visualization panel", action: toggleVisualization },
  ]

  const filteredCommands = commandQuery
    ? commands.filter((cmd) => cmd.name.toLowerCase().includes(commandQuery.toLowerCase()))
    : commands

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }

      // Close command palette: Escape
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCommandPaletteOpen])

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        isFullscreen
          ? "fixed inset-0 z-50 bg-background"
          : "h-[calc(100vh-6rem)] max-w-6xl mx-auto w-full rounded-xl overflow-hidden border border-border shadow-lg",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
            animate={controls}
          >
            <IconBrain className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">AGENT 2.0</h1>
            <p className="text-xs text-muted-foreground">Genomic Analysis Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <SecurityBadge type="hipaa" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleClearChat}>
                  <IconX className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleVisualization}>
                  {isVisualizationOpen ? (
                    <IconChevronUp className="h-5 w-5" />
                  ) : (
                    <IconChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle visualization</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <IconMinimize className="h-5 w-5" /> : <IconMaximize className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-1"
          >
            <IconCommand className="h-4 w-4" />
            <span className="hidden sm:inline">Command</span>
            <kbd className="ml-1 hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Main content area with chat and visualization */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Visualization panel (collapsible) */}
        <AnimatePresence>
          {isVisualizationOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "300px", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-border bg-card/30"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <div className="flex justify-between items-center px-4 pt-2">
                  <TabsList>
                    <TabsTrigger value="chat" className="flex items-center gap-1">
                      <IconBrain className="h-4 w-4" />
                      <span>Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="genomic" className="flex items-center gap-1">
                      <IconDna className="h-4 w-4" />
                      <span>Genomic</span>
                    </TabsTrigger>
                    <TabsTrigger value="lab" className="flex items-center gap-1">
                      <IconFlask className="h-4 w-4" />
                      <span>Laboratory</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-4 h-[calc(300px-48px)] overflow-y-auto">
                  <TabsContent value="chat" className="h-full mt-0">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-md">
                        <IconBrain className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          AGENT 2.0 provides advanced analysis of genomic data, helping researchers identify mutations,
                          understand their clinical significance, and explore treatment options.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="genomic" className="h-full mt-0">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-md">
                        <IconDna className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Genomic Visualization</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload genomic data or ask about specific mutations to see interactive visualizations of
                          genetic variants, protein structures, and clinical implications.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="lab" className="h-full mt-0">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-md">
                        <IconFlask className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Laboratory Data</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to laboratory information systems to access and analyze patient test results,
                          including Beaker reports and other clinical data.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-24 h-24 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      <IconBrain className="h-14 w-14 text-primary" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(46, 196, 182, 0)",
                        "0 0 0 20px rgba(46, 196, 182, 0.1)",
                        "0 0 0 0 rgba(46, 196, 182, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>

                <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to AGENT 2.0</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Your AI-powered genomic analysis assistant for oncology research and precision medicine
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <motion.div
                    className="bg-card p-6 rounded-xl border border-border"
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(46, 196, 182, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconDna className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-medium text-foreground mb-2">Analyze Genomic Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload genomic files or ask questions about mutations, biomarkers, and clinical implications
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-card p-6 rounded-xl border border-border"
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(46, 196, 182, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconFileText className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-medium text-foreground mb-2">Access Research</h3>
                    <p className="text-sm text-muted-foreground">
                      Get insights from the latest oncology research, clinical trials, and treatment guidelines
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border rounded-tl-none",
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.role === "user" ? (
                      <p>{message.content}</p>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <motion.div className="flex space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 rounded-full bg-primary/70"
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">AGENT is thinking...</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File Preview Area */}
        <AnimatePresence>
          {filePreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-3 bg-card/50 backdrop-blur-sm border-t border-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <IconFileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{filePreview.name}</p>
                    <p className="text-xs text-muted-foreground">{(filePreview.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={cancelFileUpload}>
                  <IconX className="h-5 w-5" />
                </Button>
              </div>

              {isUploading && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Analyzing genomic data...</p>
                    <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick reply suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-3 border-t border-border"
            >
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                    >
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex space-x-2 mb-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".csv,.txt,.fasta,.vcf,.pdf,.json"
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="rounded-full h-10 w-10"
                  >
                    <IconUpload className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload genomic file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <textarea
                className="w-full bg-card/50 border border-border rounded-lg py-3 pl-4 pr-24 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[50px] max-h-[150px]"
                rows={1}
                placeholder="Ask about genomic data or oncology research..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (!isLoading && input.trim()) {
                      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                    }
                  }
                }}
                disabled={isLoading || isUploading || isListening}
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={isListening ? "destructive" : "ghost"}
                        size="icon"
                        className="rounded-full"
                        onClick={toggleVoiceInput}
                        disabled={isLoading || isUploading}
                      >
                        <IconMicrophone className="h-5 w-5" />
                        {isListening && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(239, 68, 68, 0)",
                                "0 0 0 4px rgba(239, 68, 68, 0.3)",
                                "068,68,0)",
                                "0 0 0 4px rgba(239, 68, 68, 0.3)",
                                "0 0 0 0 rgba(239, 68, 68, 0)",
                              ],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        disabled={isLoading || !input.trim() || isUploading || isListening}
                        size="icon"
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <IconSend className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {isListening && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-destructive"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  <p className="text-sm">Listening...</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center">
                <IconCommand className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground"
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command) => (
                    <button
                      key={command.id}
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 flex items-center"
                      onClick={() => {
                        command.action()
                        setIsCommandPaletteOpen(false)
                      }}
                    >
                      <span>{command.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">No commands found</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to format markdown
function formatMarkdown(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/\n/g, "<br>")
    .replace(/- (.*?)$/gm, "• $1<br>")
}

