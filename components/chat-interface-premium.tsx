"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue } from "framer-motion"
import { useChat } from "ai/react"
import {
  IconSend,
  IconMicrophone,
  IconMicrophoneOff,
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
  IconVolume,
  IconVolumeOff,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconDownload,
  IconShare,
  IconInfoCircle,
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useChatStore } from "@/store/chat-store"
import { processGenomicFile } from "@/utils/fileUploadApi"
import { generateQuickReplySuggestions } from "@/utils/chatbotApi"
import { SecurityBadge } from "@/components/ui/security-badge"
import { cn } from "@/lib/utils"

// Define types for our data
interface GenomicVariant {
  id: string
  gene: string
  chromosome: string
  position: number
  reference: string
  alternate: string
  significance: "Pathogenic" | "Likely Pathogenic" | "Uncertain" | "Likely Benign" | "Benign"
  condition?: string
}

interface LabResult {
  id: string
  test: string
  value: string
  unit: string
  referenceRange: string
  date: string
  abnormal: boolean
}

// Sample data for visualizations
const sampleGenomicVariants: GenomicVariant[] = [
  {
    id: "var1",
    gene: "BRCA1",
    chromosome: "17",
    position: 43106453,
    reference: "G",
    alternate: "A",
    significance: "Pathogenic",
    condition: "Hereditary Breast and Ovarian Cancer",
  },
  {
    id: "var2",
    gene: "EGFR",
    chromosome: "7",
    position: 55242464,
    reference: "T",
    alternate: "G",
    significance: "Pathogenic",
    condition: "Non-small Cell Lung Cancer",
  },
  {
    id: "var3",
    gene: "KRAS",
    chromosome: "12",
    position: 25398284,
    reference: "C",
    alternate: "T",
    significance: "Pathogenic",
    condition: "Colorectal Cancer",
  },
  {
    id: "var4",
    gene: "TP53",
    chromosome: "17",
    position: 7578406,
    reference: "G",
    alternate: "A",
    significance: "Likely Pathogenic",
    condition: "Li-Fraumeni Syndrome",
  },
  {
    id: "var5",
    gene: "BRAF",
    chromosome: "7",
    position: 140453136,
    reference: "A",
    alternate: "T",
    significance: "Pathogenic",
    condition: "Melanoma",
  },
]

const sampleLabResults: LabResult[] = [
  {
    id: "lab1",
    test: "White Blood Cell Count",
    value: "11.5",
    unit: "10^9/L",
    referenceRange: "4.5-11.0",
    date: "2023-05-15",
    abnormal: true,
  },
  {
    id: "lab2",
    test: "Hemoglobin",
    value: "14.2",
    unit: "g/dL",
    referenceRange: "13.5-17.5",
    date: "2023-05-15",
    abnormal: false,
  },
  {
    id: "lab3",
    test: "Platelet Count",
    value: "140",
    unit: "10^9/L",
    referenceRange: "150-450",
    date: "2023-05-15",
    abnormal: true,
  },
  {
    id: "lab4",
    test: "Glucose",
    value: "105",
    unit: "mg/dL",
    referenceRange: "70-99",
    date: "2023-05-15",
    abnormal: true,
  },
  {
    id: "lab5",
    test: "Creatinine",
    value: "0.9",
    unit: "mg/dL",
    referenceRange: "0.6-1.2",
    date: "2023-05-15",
    abnormal: false,
  },
]

function ChatInterfacePremiumComponent() {
  // State for UI elements
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<File | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("genomic")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false)
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null)
  const [recognitionTranscript, setRecognitionTranscript] = useState("")
  const [visualizationHeight, setVisualizationHeight] = useState(350)
  const [speechRate, setSpeechRate] = useState(1)
  const [speechPitch, setSpeechPitch] = useState(1)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<GenomicVariant | null>(null)
  const [filteredVariants, setFilteredVariants] = useState<GenomicVariant[]>(sampleGenomicVariants)
  const [variantSearchQuery, setVariantSearchQuery] = useState("")
  const [showPathogenicOnly, setShowPathogenicOnly] = useState(false)
  const [recognitionConfidence, setRecognitionConfidence] = useState(0)
  const [recognitionError, setRecognitionError] = useState<string | null>(null)
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [patientInfo, setPatientInfo] = useState({
    name: "John Doe",
    id: "PT-12345",
    age: 45,
    gender: "Male",
    diagnosis: "Non-small Cell Lung Cancer",
  })

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Hooks
  const { toast } = useToast()
  const controls = useAnimation()
  const pulseControls = useAnimation()
  const dragY = useMotionValue(0)
  const setIsAnalyzing = useChatStore((state) => state.setIsAnalyzing)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = "en-US"

          recognition.onresult = (event: any) => {
            const current = event.resultIndex
            const transcript = event.results[current][0].transcript
            const confidence = event.results[current][0].confidence
            setRecognitionTranscript(transcript)
            setRecognitionConfidence(confidence * 100)
          }

          recognition.onerror = (event: any) => {
            setRecognitionError(`Error: ${event.error}`)
            setIsListening(false)
          }

          recognition.onend = () => {
            if (isListening) {
              try {
                recognition.start()
              } catch (e) {
                // Already started
              }
            }
          }

          recognitionRef.current = recognition
          setIsRecognitionSupported(true)
        } catch (e) {
          console.error("Error initializing speech recognition:", e)
          setIsRecognitionSupported(false)
          setRecognitionError("Speech recognition initialization failed")
        }
      } else {
        setIsRecognitionSupported(false)
        setRecognitionError("Speech recognition not supported in this browser")
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Already stopped
        }
      }
    }
  }, [])

  // Handle speech recognition state changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          // Recognition might already be started
        }
      } else {
        try {
          recognitionRef.current.stop()
          if (recognitionTranscript) {
            setInput(recognitionTranscript)
            setRecognitionTranscript("")
          }
        } catch (error) {
          // Recognition might already be stopped
        }
      }
    }
  }, [isListening])

  // Initialize chat
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput, reload, stop, setMessages } =
    useChat({
      api: "/api/chat",
      onFinish: (message) => {
        scrollToBottom()
        // Generate suggestions based on the AI's response
        const newSuggestions = generateQuickReplySuggestions(message.content)
        setSuggestions(newSuggestions)
        setShowWelcomeScreen(false)
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

  // Scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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

    pulseControls.start({
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    })
  }, [controls, pulseControls])

  // Filter variants based on search and filters
  useEffect(() => {
    let filtered = sampleGenomicVariants

    if (variantSearchQuery) {
      const query = variantSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (variant) =>
          variant.gene.toLowerCase().includes(query) ||
          variant.chromosome.toLowerCase().includes(query) ||
          (variant.condition && variant.condition.toLowerCase().includes(query)),
      )
    }

    if (showPathogenicOnly) {
      filtered = filtered.filter(
        (variant) => variant.significance === "Pathogenic" || variant.significance === "Likely Pathogenic",
      )
    }

    setFilteredVariants(filtered)
  }, [variantSearchQuery, showPathogenicOnly])

  // Handle voice recognition toggle
  const toggleVoiceInput = () => {
    if (!isRecognitionSupported) {
      toast({
        title: "Speech Recognition Not Available",
        description: recognitionError || "Your browser doesn't support speech recognition",
        variant: "destructive",
      })
      return
    }

    setIsListening(!isListening)

    if (!isListening) {
      toast({
        title: "Voice Recognition Active",
        description: "Speak clearly into your microphone",
      })
    } else {
      if (recognitionTranscript) {
        setInput(recognitionTranscript)
        setRecognitionTranscript("")
      }
    }
  }

  // Text-to-speech functionality
  const speakMessage = (messageId: string, content: string) => {
    // Stop any current speech
    window.speechSynthesis.cancel()

    if (currentSpeakingMessageId === messageId) {
      setSpeechSynthesisActive(false)
      setCurrentSpeakingMessageId(null)
      return
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(content)
    utterance.rate = speechRate
    utterance.pitch = speechPitch

    // Get available voices and set a good one if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice =
      voices.find((voice) => voice.name.includes("Google") && voice.name.includes("US English")) ||
      voices.find((voice) => voice.lang === "en-US")

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    // Handle speech end
    utterance.onend = () => {
      setSpeechSynthesisActive(false)
      setCurrentSpeakingMessageId(null)
    }

    // Handle speech error
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setSpeechSynthesisActive(false)
      setCurrentSpeakingMessageId(null)
      toast({
        title: "Speech Error",
        description: "There was an error with text-to-speech",
        variant: "destructive",
      })
    }

    // Store reference and start speaking
    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setSpeechSynthesisActive(true)
    setCurrentSpeakingMessageId(messageId)
  }

  // Stop speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Handle chat actions
  const handleClearChat = () => {
    setMessages([])
    setSuggestions([])
    setShowWelcomeScreen(true)
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

  // File upload handling
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
      setShowWelcomeScreen(false)

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

  // UI interaction handlers
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Resizable panel functionality
  useEffect(() => {
    const handleMouseDown = () => {
      isDraggingRef.current = true
      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const newHeight = Math.max(200, Math.min(600, e.clientY - 100))
        setVisualizationHeight(newHeight)
      }
    }

    const handle = resizeHandleRef.current
    if (handle) {
      handle.addEventListener("mousedown", handleMouseDown)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (handle) {
        handle.removeEventListener("mousedown", handleMouseDown)
      }
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

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
    { id: "darkmode", name: "Toggle dark mode", action: toggleDarkMode },
    { id: "settings", name: "Open settings", action: () => setIsSettingsOpen(true) },
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

      // Close settings: Escape
      if (e.key === "Escape" && isSettingsOpen) {
        setIsSettingsOpen(false)
      }

      // Submit with Enter
      if (e.key === "Enter" && !e.shiftKey && document.activeElement === document.querySelector("textarea")) {
        e.preventDefault()
        if (!isLoading && input.trim()) {
          handleSubmit(new Event("submit") as any)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCommandPaletteOpen, isSettingsOpen, isLoading, input, handleSubmit])

  // Render significance badge with appropriate color
  const renderSignificanceBadge = (significance: string) => {
    let color = "bg-gray-200 text-gray-800"

    switch (significance) {
      case "Pathogenic":
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        break
      case "Likely Pathogenic":
        color = "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        break
      case "Uncertain":
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        break
      case "Likely Benign":
        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        break
      case "Benign":
        color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        break
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {significance}
      </span>
    )
  }

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
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/20 flex items-center justify-center"
            animate={controls}
          >
            <IconBrain className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">AGENT 3.0</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                PREMIUM
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Advanced Genomic Analysis Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <SecurityBadge type="hipaa" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRefreshConnection}>
                  <IconRefresh className={cn("h-5 w-5", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isLoading ? "Stop generation" : "Refresh connection"}</TooltipContent>
            </Tooltip>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconSettings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <IconSettings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleDarkMode}>
                <IconCommand className="mr-2 h-4 w-4" />
                <span>Toggle Dark Mode</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <IconUpload className="mr-2 h-4 w-4" />
                <span>Upload File</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              animate={{ height: `${visualizationHeight}px`, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-border bg-card/30 relative"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <div className="flex justify-between items-center px-4 pt-2">
                  <TabsList>
                    <TabsTrigger value="genomic" className="flex items-center gap-1">
                      <IconDna className="h-4 w-4" />
                      <span>Genomic</span>
                    </TabsTrigger>
                    <TabsTrigger value="lab" className="flex items-center gap-1">
                      <IconFlask className="h-4 w-4" />
                      <span>Laboratory</span>
                    </TabsTrigger>
                    <TabsTrigger value="patient" className="flex items-center gap-1">
                      <IconUser className="h-4 w-4" />
                      <span>Patient</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="h-8 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={variantSearchQuery}
                        onChange={(e) => setVariantSearchQuery(e.target.value)}
                      />
                      <IconSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            <IconFilter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex items-center gap-2 p-1">
                            <Switch
                              id="pathogenic-only"
                              checked={showPathogenicOnly}
                              onCheckedChange={setShowPathogenicOnly}
                            />
                            <label htmlFor="pathogenic-only" className="text-sm">
                              Pathogenic only
                            </label>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            <IconDownload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export data</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
                  <TabsContent value="genomic" className="h-full mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                      <div className="col-span-1 overflow-y-auto pr-2 border-r border-border">
                        <h3 className="text-sm font-medium mb-2">Genomic Variants</h3>
                        <div className="space-y-2">
                          {filteredVariants.length > 0 ? (
                            filteredVariants.map((variant) => (
                              <div
                                key={variant.id}
                                className={cn(
                                  "p-3 rounded-lg border cursor-pointer transition-all",
                                  selectedVariant?.id === variant.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 hover:bg-primary/5",
                                )}
                                onClick={() => setSelectedVariant(variant)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{variant.gene}</div>
                                  {renderSignificanceBadge(variant.significance)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Chr{variant.chromosome}:{variant.position} {variant.reference}&gt;{variant.alternate}
                                </div>
                                {variant.condition && (
                                  <div className="text-xs mt-1 text-foreground/80">{variant.condition}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No variants match your search criteria
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2">
                        {selectedVariant ? (
                          <div className="h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h2 className="text-xl font-bold">{selectedVariant.gene}</h2>
                                <p className="text-sm text-muted-foreground">
                                  Chromosome {selectedVariant.chromosome}, Position {selectedVariant.position}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8">
                                  <IconInfoCircle className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                                <Button variant="outline" size="sm" className="h-8">
                                  <IconShare className="h-4 w-4 mr-1" />
                                  Share
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="p-4 rounded-lg border border-border bg-card/50">
                                <h3 className="text-sm font-medium mb-2">Variant Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span>SNV (Single Nucleotide Variant)</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference:</span>
                                    <span>{selectedVariant.reference}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Alternate:</span>
                                    <span>{selectedVariant.alternate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Clinical Significance:</span>
                                    <span>{selectedVariant.significance}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Associated Condition:</span>
                                    <span>{selectedVariant.condition || "Unknown"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card/50">
                                <h3 className="text-sm font-medium mb-2">Clinical Impact</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Therapy Implications:</span>
                                    <span>Targeted therapy candidate</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">FDA Approved Drugs:</span>
                                    <span>Available</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Clinical Trials:</span>
                                    <span>12 active trials</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prevalence:</span>
                                    <span>4.2% in this cancer type</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prognosis Impact:</span>
                                    <span>Moderate</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-lg border border-border bg-card/50 h-[calc(100%-220px)] min-h-[150px] flex items-center justify-center">
                              <div className="text-center">
                                <IconDna className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  3D protein structure visualization would appear here
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-md">
                              <IconDna className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold mb-2">Select a Variant</h3>
                              <p className="text-sm text-muted-foreground">
                                Choose a genomic variant from the list to view detailed information, clinical
                                significance, and treatment implications.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="lab" className="h-full mt-0">
                    <div className="h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Laboratory Results</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <IconCalendar className="h-4 w-4 mr-1" />
                            Filter by Date
                          </Button>
                          <Button variant="outline" size="sm">
                            <IconChartBar className="h-4 w-4 mr-1" />
                            View Trends
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-3 text-left text-sm font-medium">Test</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Result</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Reference Range</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {sampleLabResults.map((result) => (
                              <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 text-sm">{result.test}</td>
                                <td className="px-4 py-3 text-sm font-medium">
                                  <span className={result.abnormal ? "text-red-500 dark:text-red-400" : ""}>
                                    {result.value} {result.unit}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{result.referenceRange}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{result.date}</td>
                                <td className="px-4 py-3 text-sm">
                                  {result.abnormal ? (
                                    <Badge variant="destructive" className="font-normal">
                                      Abnormal
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0 font-normal"
                                    >
                                      Normal
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-4 rounded-lg border border-border bg-card/50">
                        <h4 className="text-sm font-medium mb-2">Laboratory Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient's white blood cell count and platelet count are outside normal ranges. Glucose levels
                          are slightly elevated. Recommend follow-up testing in 2 weeks.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="patient" className="h-full mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                      <div className="col-span-1 p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/20 text-primary text-xl">
                              {patientInfo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium">{patientInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">{patientInfo.id}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Age:</span>
                            <span>{patientInfo.age}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gender:</span>
                            <span>{patientInfo.gender}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Diagnosis:</span>
                            <span>{patientInfo.diagnosis}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Diagnosis Date:</span>
                            <span>2023-01-15</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stage:</span>
                            <span>IIIB</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Treating Physician:</span>
                            <span>Dr. Sarah Johnson</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-medium mb-2">Current Treatment</h4>
                          <div className="space-y-2">
                            <div className="p-2 rounded bg-primary/10 text-sm">
                              <div className="font-medium">Osimertinib</div>
                              <div className="text-xs text-muted-foreground">80mg daily, started 2023-02-01</div>
                            </div>
                            <div className="p-2 rounded bg-muted text-sm">
                              <div className="font-medium">Radiation Therapy</div>
                              <div className="text-xs text-muted-foreground">Completed 2023-03-15</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 space-y-4">
                        <div className="p-4 rounded-lg border border-border bg-card/50">
                          <h3 className="text-sm font-medium mb-2">Clinical Timeline</h3>
                          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                            {[
                              {
                                date: "2023-01-10",
                                event: "Initial presentation with persistent cough and weight loss",
                              },
                              { date: "2023-01-15", event: "Diagnosis: Non-small Cell Lung Cancer, Stage IIIB" },
                              { date: "2023-01-20", event: "Genomic testing ordered, EGFR mutation detected" },
                              { date: "2023-02-01", event: "Started targeted therapy with Osimertinib" },
                              { date: "2023-03-01", event: "Follow-up imaging shows 30% reduction in tumor size" },
                              { date: "2023-03-15", event: "Completed radiation therapy to primary site" },
                              { date: "2023-05-01", event: "Follow-up imaging shows stable disease" },
                            ].map((item, index) => (
                              <div key={index} className="relative">
                                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-primary"></div>
                                <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                                <div className="text-sm">{item.event}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border border-border bg-card/50">
                            <h3 className="text-sm font-medium mb-2">Genomic Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Key Mutations:</span>
                                <span>EGFR L858R, TP53 R273H</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tumor Mutational Burden:</span>
                                <span>Low (3.2 mut/Mb)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Microsatellite Status:</span>
                                <span>Stable (MSS)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">PD-L1 Expression:</span>
                                <span>10% (Low)</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg border border-border bg-card/50">
                            <h3 className="text-sm font-medium mb-2">Treatment Recommendations</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Badge className="mt-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Primary
                                </Badge>
                                <div>Continue Osimertinib 80mg daily</div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Badge className="mt-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Alternative
                                </Badge>
                                <div>Consider Gefitinib if intolerance develops</div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Badge className="mt-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                  Trial
                                </Badge>
                                <div>Eligible for NCT03778229 (Phase II)</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-card/50">
                          <h3 className="text-sm font-medium mb-2">Notes</h3>
                          <p className="text-sm text-muted-foreground">
                            Patient is responding well to targeted therapy. Minimal side effects reported (Grade 1 rash,
                            fatigue). Continue monitoring with imaging every 2 months. Consider liquid biopsy at next
                            visit to monitor for resistance mutations. Patient enrolled in smoking cessation program.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Resize handle */}
              <div
                ref={resizeHandleRef}
                className="absolute bottom-0 left-0 right-0 h-2 bg-transparent cursor-row-resize flex items-center justify-center hover:bg-primary/20"
              >
                <div className="w-16 h-1 rounded-full bg-border hover:bg-primary/50 transition-colors" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {showWelcomeScreen && (
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
                  className="w-32 h-32 mx-auto mb-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/20 rounded-full flex items-center justify-center">
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
                      <IconBrain className="h-20 w-20 text-primary-foreground" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full"
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

                <motion.h2
                  className="text-4xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Welcome to AGENT 3.0
                </motion.h2>

                <motion.p
                  className="text-muted-foreground mb-8 max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Your premium AI-powered genomic analysis assistant for oncology research and precision medicine
                </motion.p>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
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

                  <motion.div
                    className="bg-card p-6 rounded-xl border border-border"
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(46, 196, 182, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconLayoutDashboard className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-medium text-foreground mb-2">Visualize Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive visualizations of genomic data, laboratory results, and clinical correlations
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                    onClick={() => setShowWelcomeScreen(false)}
                  >
                    Get Started
                  </Button>
                </motion.div>
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
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border rounded-tl-none",
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.role === "user" ? (
                      <p>{message.content}</p>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">AGENT 3.0</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-1.5"></span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => speakMessage(message.id, message.content)}
                            aria-label={currentSpeakingMessageId === message.id ? "Stop speaking" : "Speak message"}
                          >
                            {currentSpeakingMessageId === message.id ? (
                              <IconVolumeOff className="h-4 w-4" />
                            ) : (
                              <IconVolume className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
                      </div>
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

        {/* Voice recognition status */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-3 border-t border-border bg-card/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                    className="w-3 h-3 rounded-full bg-red-500"
                  />
                  <span className="text-sm font-medium">Listening...</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Confidence: {recognitionConfidence.toFixed(0)}%</div>
                  <Button variant="ghost" size="sm" onClick={() => setIsListening(false)}>
                    Cancel
                  </Button>
                </div>
              </div>

              {recognitionTranscript && (
                <div className="mt-2 p-3 bg-background rounded-lg border border-border">
                  <p className="text-sm">{recognitionTranscript}</p>
                </div>
              )}
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
                    className="rounded-full h-10 w-10 bg-card hover:bg-primary/10 hover:text-primary"
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
                        {isListening ? (
                          <IconMicrophoneOff className="h-5 w-5" />
                        ) : (
                          <IconMicrophone className="h-5 w-5" />
                        )}
                        {isListening && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(239, 68, 68, 0)",
                                "0 0 0 4px rgba(239, 68, 68, 0.3)",
                                "0 0 0 0 rgba(239, 68 68, 68, 0)",
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
                        className="rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
                      >
                        <IconSend className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
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

      {/* Settings panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Settings</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)}>
                  <IconX className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Appearance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="dark-mode" className="text-sm">
                        Dark Mode
                      </label>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="visualization" className="text-sm">
                        Show Visualization Panel
                      </label>
                      <Switch id="visualization" checked={isVisualizationOpen} onCheckedChange={toggleVisualization} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Text-to-Speech</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="speech-rate" className="text-sm">
                          Speech Rate
                        </label>
                        <span className="text-xs text-muted-foreground">{speechRate.toFixed(1)}x</span>
                      </div>
                      <Slider
                        id="speech-rate"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[speechRate]}
                        onValueChange={(value) => setSpeechRate(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="speech-pitch" className="text-sm">
                          Speech Pitch
                        </label>
                        <span className="text-xs text-muted-foreground">{speechPitch.toFixed(1)}</span>
                      </div>
                      <Slider
                        id="speech-pitch"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[speechPitch]}
                        onValueChange={(value) => setSpeechPitch(value[0])}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(
                          "This is a test of the speech synthesis settings",
                        )
                        utterance.rate = speechRate
                        utterance.pitch = speechPitch
                        window.speechSynthesis.speak(utterance)
                      }}
                    >
                      Test Speech
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">About</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>AGENT 3.0 Premium</p>
                    <p>Version 3.0.1</p>
                    <p>© 2023 Genomic Intelligence, Inc.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border flex justify-end">
                <Button onClick={() => setIsSettingsOpen(false)}>Close</Button>
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
    .replace(/`(.*?)`/g, '<code class="bg-muted/50 px-1 py-0.5 rounded text-xs">$1</code>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/\n/g, "<br>")
    .replace(/- (.*?)$/gm, '<div class="flex items-start my-1"><span class="mr-2">•</span><span>$1</span></div>')
}

export default ChatInterfacePremiumComponent

