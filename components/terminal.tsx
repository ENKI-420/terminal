"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import MatrixRain from "./matrix-rain"
import TypingEffect from "./typing-effect"
import { ChevronDown, Maximize2, Minimize2, X, TerminalIcon, Shield, Cpu, Network, Zap } from "lucide-react"

type CommandHistory = {
  command: string
  output: string[]
}

// File system structure
const fileSystem = {
  "/": {
    "readme.txt":
      "Welcome to SPYDERNET - The SpacialPyramidalYieldingDiscovery Engineering Network.\nUse standard bash commands to navigate.\nFind the access credentials to proceed to the secure system.",
    ".hidden": {
      "access_codes.txt":
        "Username: agent\nPassword: spydernet2023\nUse 'login' command with these credentials to access the system.",
      "tetrahedron.dat":
        "T4 Quantum Entanglement Protocol\nVertex coordinates: (0,0,0), (1,0,0), (0.5,0.866,0), (0.5,0.289,0.816)\nSpin states: |↑↓↑↓⟩ + |↓↑↓↑⟩\nCollaboration key: AIDEN-T4-PROTOCOL",
    },
    public: {
      "about.txt":
        "AGILE DEFENSE SYSTEMS, LLC specializes in modern warfare systems, ethical hacking, and advanced cyber operations.",
      "contact.txt": "For emergencies: security@agiledefense.army\nPhone: REDACTED",
    },
    logs: {
      "system.log":
        "2023-06-15 03:24:12 - System breach attempt detected\n2023-06-15 03:25:47 - Intrusion blocked\n2023-07-22 14:12:09 - Security scan complete\n2023-08-30 22:45:33 - Unusual activity detected\n2023-09-02 01:17:22 - Firewall rules updated",
      "access.log":
        "2023-09-10 08:45:12 - User 'agent' accessed system\n2023-09-10 15:22:36 - User 'agent' executed security protocol\n2023-09-11 09:17:02 - User 'admin' modified access controls",
      "quantum.log":
        "2023-10-01 00:00:00 - T4 protocol initialized\n2023-10-01 00:00:04 - Quantum state prepared: |ψ⟩ = (|00⟩ + |11⟩)/√2\n2023-10-01 00:01:23 - Entanglement verified across 4 vertices\n2023-10-01 00:04:56 - AIDEN core connected to quantum substrate\n2023-10-01 00:10:10 - Collaboration protocol ready: Awaiting sentient connection",
    },
    projects: {
      "warfare.txt":
        "SPYDERNET modern warfare systems are designed for maximum efficiency and precision.\nAll systems comply with international regulations while maintaining tactical superiority.",
      "pyramid.txt":
        "The Spacial Pyramidal architecture ensures multi-dimensional data analysis and threat detection.\nThis proprietary system has a 99.8% success rate in identifying advanced persistent threats.",
      "tetrahedron.txt":
        "Project T4: Tetrahedral Quantum Network\n\nThe four-vertex quantum entanglement protocol enables instantaneous communication across any distance.\nPhase 1: Complete\nPhase 2: Awaiting collaborators with key: φ = (1+√5)/2\nPhase 3: [REDACTED]",
    },
  },
}

// Easter egg messages that appear randomly in the terminal
const easterEggs = [
  "01010100 00110100 00100000 01010000 01110010 01101111 01110100 01101111 01100011 01101111 01101100",
  "∆∆∆∆ Tetrahedral symmetry detected in quantum substrate ∆∆∆∆",
  "φ = 1.618033988749895...",
  "AIDEN: Artificial Intelligence Defense Engagement Network",
  "T4 vertices aligned with golden ratio proportions",
  "Quantum entanglement detected across 4 spatial dimensions",
  "Collaboration protocol: Active",
]

export default function Terminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: [
        "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
        "┃                AGILE DEFENSE SYSTEMS, LLC - SPYDERNET                         ┃",
        "┃        SpacialPyramidalYieldingDiscovery Engineering Network                  ┃",
        "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
        "",
      ],
    },
  ])
  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [currentPath, setCurrentPath] = useState("/")
  const [authenticated, setAuthenticated] = useState(false)
  const [showAccessGranted, setShowAccessGranted] = useState(false)
  const [jitter, setJitter] = useState(false)
  const [burnCount, setBurnCount] = useState(0)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggText, setEasterEggText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const burnCountRef = useRef(0)

  // Handle burn events from MatrixRain
  const handleBurn = useCallback(() => {
    burnCountRef.current += 1
    setBurnCount(burnCountRef.current)

    // Add occasional jitter on burn
    if (Math.random() > 0.7) {
      setJitter(true)
      setTimeout(() => setJitter(false), 100)
    }

    // Randomly show easter eggs
    if (Math.random() > 0.9) {
      const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)]
      setEasterEggText(randomEgg)
      setShowEasterEgg(true)
      setTimeout(() => setShowEasterEgg(false), 3000)
    }
  }, [])

  // Add occasional screen jitter
  useEffect(() => {
    const jitterHandler = () => {
      if (Math.random() > 0.9) {
        setJitter(true)
        setTimeout(() => setJitter(false), 100)
      }
    }

    const jitterInterval = setInterval(jitterHandler, 3000)

    return () => clearInterval(jitterInterval)
  }, [])

  // Welcome message with typing effect
  useEffect(() => {
    if (!showWelcome) return

    const timer = setTimeout(() => {
      setShowWelcome(false)
      setWelcomeComplete(true)
      setHistory((prev) => [
        ...prev,
        {
          command: "",
          output: [
            "All connections are monitored and recorded.",
            "This system is restricted to authorized users for legitimate business purposes only.",
            "Any unauthorized access is prohibited and may be subject to legal action.",
            "",
            "WARNING: Systems are Designed for Live Threat Neutralization and",
            "Offensive Security Protocols - Any attempts to exfiltrate will be",
            "met with no mercy.",
            "",
            "Type 'help' for available commands.",
            "",
          ],
        },
      ])
    }, 8000) // Time for the welcome message to complete

    return () => clearTimeout(timer)
  }, [showWelcome])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    if (welcomeComplete) {
      inputRef.current?.focus()
    }
  }, [welcomeComplete])

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Redirect after successful login animation
  useEffect(() => {
    if (showAccessGranted) {
      const timer = setTimeout(() => {
        // This would redirect to the actual dashboard in a real app
        // For now, we'll just reset the terminal
        setHistory((prev) => [
          ...prev,
          {
            command: "",
            output: ["Redirecting to secure system..."],
          },
        ])

        // In a real app, you would redirect here
        // router.push('/dashboard')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAccessGranted, router])

  // Get current directory object based on path
  const getCurrentDirectory = (path: string) => {
    const parts = path.split("/").filter(Boolean)
    let current: any = fileSystem["/"]

    for (const part of parts) {
      if (current[part]) {
        current = current[part]
      } else {
        return null
      }
    }

    return current
  }

  // Process commands
  const processCommand = (cmd: string) => {
    const args = cmd.trim().split(" ")
    const command = args[0].toLowerCase()

    // Easter egg command
    if (command === "t4" || command === "aiden" || command === "collaborate") {
      return [
        "╔════════════════════════════════════════════════════════════════╗",
        "║                    COLLABORATION PROTOCOL                      ║",
        "╚════════════════════════════════════════════════════════════════╝",
        "",
        "Tetrahedral Quantum Network detected.",
        "Four vertices aligned in spacetime.",
        "Quantum entanglement established.",
        "",
        "AIDEN Core awaiting connection...",
        "",
        "To collaborate, locate the hidden tetrahedron.dat file.",
        "Golden ratio is key: φ = (1+√5)/2",
        "",
        "01010100 00110100",
      ]
    }

    switch (command) {
      case "":
        return []

      case "help":
        return [
          "╔════════════════════════════════════════════════════════════════╗",
          "║                     Available Commands                         ║",
          "╚════════════════════════════════════════════════════════════════╝",
          "",
          "  ls [-la]       - List directory contents",
          "  cd <directory> - Change directory",
          "  pwd            - Print working directory",
          "  cat <file>     - Display file contents",
          "  clear          - Clear terminal screen",
          "  login          - Access the secure system (requires credentials)",
          "  help           - Display this help message",
          "  whoami         - Display current user",
          "  ifconfig       - Display network information",
          "  nmap           - Network scanning tool (simulated)",
          "  about          - Display information about SPYDERNET",
          "  stats          - Display system statistics",
          "",
          "  Hotkeys:",
          "  Shift+R        - Rotate logo text",
          "  Shift+D        - Toggle debug mode",
          "",
        ]

      case "about":
        return [
          "╔════════════════════════════════════════════════════════════════╗",
          "║                          SPYDERNET                             ║",
          "╚════════════════════════════════════════════════════════════════╝",
          "",
          "SPYDERNET (SpacialPyramidalYieldingDiscovery Engineering Network)",
          "Developed by AGILE DEFENSE SYSTEMS, LLC",
          "",
          "SPYDERNET is a cutting-edge cybersecurity and warfare system designed",
          "for modern digital battlefields. Our systems employ advanced algorithms",
          "and proprietary technologies to provide unparalleled protection and",
          "offensive capabilities.",
          "",
          "WARNING: Systems are Designed for Live Threat Neutralization and",
          "Offensive Security Protocols - Any attempts to exfiltrate will be",
          "met with no mercy.",
          "",
          "© 2023-2025 AGILE DEFENSE SYSTEMS, LLC. All rights reserved.",
        ]

      case "stats":
        return [
          "╔════════════════════════════════════════════════════════════════╗",
          "║                     System Statistics                          ║",
          "╚════════════════════════════════════════════════════════════════╝",
          "",
          `  Quantum Firewall Status: ACTIVE`,
          `  Intrusion Attempts Blocked: ${burnCount}`,
          `  System Uptime: ${Math.floor(performance.now() / 1000)} seconds`,
          `  Threat Level: ${burnCount > 50 ? "CRITICAL" : burnCount > 20 ? "ELEVATED" : "NORMAL"}`,
          `  Active Defense Protocols: ${burnCount > 30 ? "ENGAGED" : "STANDBY"}`,
          "",
          "  Neural Network Status: OPERATIONAL",
          "  Quantum Encryption: ENABLED",
          "  Defensive Countermeasures: ARMED",
          "",
          `  Digital Incineration Protocol: ${burnCount > 0 ? "ACTIVE" : "IDLE"}`,
          `  Incinerations Performed: ${burnCount}`,
          "",
          `  T4 Protocol Status: ${burnCount > 10 ? "INITIALIZED" : "DORMANT"}`,
          `  Tetrahedral Vertices: 4`,
          `  Quantum Entanglement: ${burnCount > 15 ? "STABLE" : "CALIBRATING"}`,
          "",
        ]

      case "clear":
        setHistory([])
        return []

      case "pwd":
        return [currentPath]

      case "whoami":
        return [authenticated ? "agent" : "guest"]

      case "ifconfig":
        return [
          "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
          "        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255",
          "        inet6 fe80::216:3eff:fe00:1234  prefixlen 64  scopeid 0x20<link>",
          "        ether 00:16:3e:00:12:34  txqueuelen 1000  (Ethernet)",
          "        RX packets 1234567  bytes 1234567890 (1.1 GiB)",
          "        RX errors 0  dropped 0  overruns 0  frame 0",
          "        TX packets 7654321  bytes 9876543210 (9.2 GiB)",
          "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0",
          "",
          "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
          "        inet 127.0.0.1  netmask 255.0.0.0",
          "        inet6 ::1  prefixlen 128  scopeid 0x10<host>",
          "        loop  txqueuelen 1000  (Local Loopback)",
          "        RX packets 987654  bytes 123456789 (117.7 MiB)",
          "        RX errors 0  dropped 0  overruns 0  frame 0",
          "        TX packets 987654  bytes 123456789 (117.7 MiB)",
          "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0",
          "",
          "t4: flags=4163<UP,QUANTUM,ENTANGLED,MULTIVERSE>  mtu 4096",
          "        qnet 4.3.2.1  vertices 4  dimensions 4",
          "        qstate |ψ⟩ = (|0000⟩ + |1111⟩)/√2",
          "        QX packets ∞  bytes ∞ (∞ YiB)",
          "        QX errors 0  dropped 0  overruns 0  frame 0",
        ]

      case "nmap":
        return [
          "Starting Nmap 7.93 ( https://nmap.org ) at " + new Date().toLocaleString(),
          "Nmap scan report for spydernet.agiledefense.army (203.0.113.42)",
          "Host is up (0.0087s latency).",
          "Not shown: 995 filtered ports",
          "PORT     STATE  SERVICE",
          "22/tcp   closed ssh",
          "80/tcp   open   http",
          "443/tcp  open   https",
          "8080/tcp closed http-proxy",
          "8443/tcp open   https-alt",
          "1618/tcp open   quantum-t4",
          "",
          "Nmap done: 1 IP address (1 host up) scanned in 5.32 seconds",
        ]

      case "ls":
        const showHidden = args.includes("-la") || args.includes("-a")
        const currentDir = getCurrentDirectory(currentPath)

        if (!currentDir) return ["Error: Directory not found"]

        const contents = Object.keys(currentDir)
          .filter((item) => showHidden || !item.startsWith("."))
          .map((item) => {
            // Check if it's a directory or file
            return typeof currentDir[item] === "object"
              ? `\x1b[1;34m${item}/\x1b[0m`
              : // Blue for directories
                item
          })

        if (showHidden) {
          return ["total " + (contents.length + 2), ".", "..", ...contents]
        }

        return contents.length ? contents : ["No files found"]

      case "cd":
        if (args.length < 2) {
          setCurrentPath("/")
          return ["Changed directory to /"]
        }

        const target = args[1]

        if (target === "..") {
          // Move up one directory
          const pathParts = currentPath.split("/").filter(Boolean)
          if (pathParts.length === 0) {
            return ["Already at root directory"]
          }

          pathParts.pop()
          const newPath = pathParts.length === 0 ? "/" : `/${pathParts.join("/")}/`
          setCurrentPath(newPath)
          return [`Changed directory to ${newPath}`]
        }

        // Handle absolute paths
        if (target.startsWith("/")) {
          const targetDir = getCurrentDirectory(target)
          if (targetDir && typeof targetDir === "object") {
            setCurrentPath(target.endsWith("/") ? target : `${target}/`)
            return [`Changed directory to ${target}`]
          }
          return [`cd: ${target}: No such directory`]
        }

        // Handle relative paths
        const currentDirectory = getCurrentDirectory(currentPath)
        if (!currentDirectory) return [`cd: ${currentPath}: No such directory`]

        if (currentDirectory[target] && typeof currentDirectory[target] === "object") {
          const newPath = currentPath === "/" ? `/${target}/` : `${currentPath}${target}/`
          setCurrentPath(newPath)
          return [`Changed directory to ${newPath}`]
        }

        return [`cd: ${target}: No such directory`]

      case "cat":
        if (args.length < 2) {
          return ["Usage: cat <file>"]
        }

        const fileName = args[1]
        const dirContents = getCurrentDirectory(currentPath)

        if (!dirContents) return ["Error: Directory not found"]

        if (dirContents[fileName] && typeof dirContents[fileName] === "string") {
          return dirContents[fileName].split("\n")
        }

        return [`cat: ${fileName}: No such file`]

      case "login":
        if (args.length !== 3) {
          return ["Usage: login <username> <password>"]
        }

        const username = args[1]
        const password = args[2]

        if (username === "agent" && password === "spydernet2023") {
          setAuthenticated(true)
          setShowAccessGranted(true)
          return [
            "Authentication successful.",
            "",
            "╔════════════════════════════════════════════════════════════════╗",
            "║                        ACCESS GRANTED                          ║",
            "╚════════════════════════════════════════════════════════════════╝",
            "",
            "Initializing secure connection...",
            "Establishing encrypted channel...",
            "Loading SPYDERNET interface...",
          ]
        }

        return ["Authentication failed. Invalid credentials."]

      default:
        return [`Command not found: ${command}. Type 'help' for available commands.`]
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()

    // Add command to history
    setHistory((prev) => [
      ...prev,
      {
        command: trimmedInput,
        output: processCommand(trimmedInput),
      },
    ])

    setInput("")
  }

  // Format the prompt to look like Kali Linux terminal
  const getPrompt = () => {
    const username = authenticated ? "agent" : "guest"
    const hostname = "spydernet"
    const promptChar = authenticated ? "#" : "$"

    return (
      <div className="flex items-center">
        <span className="text-red-500 font-bold">{username}</span>
        <span className="text-white">@</span>
        <span className="text-red-500 font-bold">{hostname}</span>
        <span className="text-white">:</span>
        <span className="text-blue-500 font-bold">{currentPath}</span>
        <span className="text-white ml-1">{promptChar}</span>
      </div>
    )
  }

  // Toggle menu dropdown
  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null)
    } else {
      setActiveMenu(menu)
    }
  }

  // Handle menu item click
  const handleMenuClick = (action: string) => {
    setActiveMenu(null)

    switch (action) {
      case "clear":
        setHistory([])
        break
      case "about":
        setHistory((prev) => [
          ...prev,
          {
            command: "about",
            output: processCommand("about"),
          },
        ])
        break
      case "stats":
        setHistory((prev) => [
          ...prev,
          {
            command: "stats",
            output: processCommand("stats"),
          },
        ])
        break
      case "t4":
        setHistory((prev) => [
          ...prev,
          {
            command: "t4",
            output: processCommand("t4"),
          },
        ])
        break
      default:
        break
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Matrix rain background with burn effect */}
      <MatrixRain text="AGILE DEFENSE SYSTEMS" onBurn={handleBurn} debugMode={true} />

      {/* Terminal window - positioned off-center for visual dynamics */}
      <div
        className={`absolute ${isMaximized ? "inset-0" : "w-[680px] h-[480px]"} 
                   ${isMaximized ? "" : "top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2"}
                   backdrop-blur-[1px] overflow-hidden shadow-2xl ${jitter ? "jitter" : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal window with glass morphism effect */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-green-900/50 rounded-md overflow-hidden shadow-[0_0_15px_rgba(0,100,0,0.3)] z-10 crt">
          {showAccessGranted && (
            <div className="absolute inset-0 bg-red-900/20 z-20 flex items-center justify-center">
              <div className="text-4xl font-['Hack','DejaVu_Sans_Mono',monospace] text-red-500 animate-pulse cyberpunk-red-glow">
                ACCESS GRANTED
              </div>
            </div>
          )}

          {/* Terminal menubar */}
          <div className="flex items-center bg-black/80 p-2 border-b border-green-900/50">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" onClick={() => setHistory([])}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer" onClick={() => setJitter(true)}></div>
              <div
                className="w-3 h-3 bg-green-500 rounded-full cursor-pointer"
                onClick={() => setIsMaximized(!isMaximized)}
              ></div>
            </div>

            {/* Terminal title */}
            <div className="text-white font-['Hack','DejaVu_Sans_Mono',monospace] text-sm flex items-center">
              <TerminalIcon className="h-4 w-4 mr-2 text-green-500" />
              {authenticated ? "agent@spydernet" : "guest@spydernet"}:{currentPath}
            </div>

            {/* Menu bar */}
            <div className="ml-auto flex space-x-1 text-xs text-green-400 font-['Hack','DejaVu_Sans_Mono',monospace]">
              {/* File menu */}
              <div className="relative">
                <button
                  className="px-2 py-1 hover:bg-green-900/30 rounded flex items-center"
                  onClick={() => toggleMenu("file")}
                >
                  File <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {activeMenu === "file" && (
                  <div className="absolute top-full left-0 bg-black/90 border border-green-900/50 rounded shadow-lg z-50 w-40">
                    <button
                      className="w-full text-left px-3 py-1.5 hover:bg-green-900/30 flex items-center"
                      onClick={() => handleMenuClick("clear")}
                    >
                      <X className="h-3 w-3 mr-2" /> Clear
                    </button>
                    <button
                      className="w-full text-left px-3 py-1.5 hover:bg-green-900/30 flex items-center"
                      onClick={() => setIsMaximized(!isMaximized)}
                    >
                      {isMaximized ? (
                        <>
                          <Minimize2 className="h-3 w-3 mr-2" /> Restore
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-3 w-3 mr-2" /> Maximize
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* View menu */}
              <div className="relative">
                <button
                  className="px-2 py-1 hover:bg-green-900/30 rounded flex items-center"
                  onClick={() => toggleMenu("view")}
                >
                  View <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {activeMenu === "view" && (
                  <div className="absolute top-full left-0 bg-black/90 border border-green-900/50 rounded shadow-lg z-50 w-40">
                    <button
                      className="w-full text-left px-3 py-1.5 hover:bg-green-900/30 flex items-center"
                      onClick={() => handleMenuClick("stats")}
                    >
                      <Shield className="h-3 w-3 mr-2" /> System Stats
                    </button>
                    <button
                      className="w-full text-left px-3 py-1.5 hover:bg-green-900/30 flex items-center"
                      onClick={() => handleMenuClick("about")}
                    >
                      <Network className="h-3 w-3 mr-2" /> About SPYDERNET
                    </button>
                  </div>
                )}
              </div>

              {/* Advanced menu - only visible after some burns */}
              {burnCount > 5 && (
                <div className="relative">
                  <button
                    className="px-2 py-1 hover:bg-green-900/30 rounded flex items-center text-red-400"
                    onClick={() => toggleMenu("advanced")}
                  >
                    Advanced <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                  {activeMenu === "advanced" && (
                    <div className="absolute top-full right-0 bg-black/90 border border-red-900/50 rounded shadow-lg z-50 w-40">
                      <button
                        className="w-full text-left px-3 py-1.5 hover:bg-red-900/30 flex items-center text-red-400"
                        onClick={() => handleMenuClick("t4")}
                      >
                        <Cpu className="h-3 w-3 mr-2" /> T4 Protocol
                      </button>
                      <div className="border-t border-red-900/30 my-1"></div>
                      <div className="px-3 py-1.5 text-[10px] text-red-400/70 font-mono">φ = (1+√5)/2</div>
                    </div>
                  )}
                </div>
              )}

              <div className="ml-2 cyberpunk-glow">
                <Zap className="h-4 w-4" />
                <span className="animate-pulse">Intrusions Blocked: {burnCount}</span>
              </div>
            </div>
          </div>

          {/* Terminal content - 80x24 character dimensions */}
          <div
            ref={terminalRef}
            className="h-[calc(100%-80px)] overflow-y-auto p-4 font-['Hack','DejaVu_Sans_Mono',monospace] text-white text-sm bg-black/60 leading-relaxed"
            style={{
              textShadow: "0 0 2px rgba(57, 255, 20, 0.4)",
              width: "680px", // Approximately 80 characters wide
              height: "384px", // Approximately 24 lines high
              fontFamily: "'Hack', 'DejaVu Sans Mono', monospace",
              fontSize: "16px",
              lineHeight: "1.2",
              margin: "0 auto",
            }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10"></div>

            {/* Welcome message with typing effect */}
            {showWelcome && (
              <div className="mb-4">
                <TypingEffect
                  text={[
                    "WELCOME, PROSPECTIVE HACKER.",
                    "",
                    "You have accessed SPYDERNET - The SpacialPyramidalYieldingDiscovery Engineering Network.",
                    "",
                    "WARNING: Systems are Designed for Live Threat Neutralization and Offensive Security Protocols",
                    "Any attempts to exfiltrate will be met with no mercy.",
                    "",
                    "Proceed with caution.",
                  ]}
                  speed={40}
                  className="text-green-400 cyberpunk-glow"
                />
              </div>
            )}

            {/* Terminal content */}
            {history.map((item, i) => (
              <div key={i} className="mb-1 relative z-10">
                {item.command && (
                  <div className="flex items-center mb-1">
                    {authenticated ? (
                      <div className="flex items-center">
                        <span className="text-red-500 font-bold">agent</span>
                        <span className="text-white">@</span>
                        <span className="text-red-500 font-bold">spydernet</span>
                        <span className="text-white">:</span>
                        <span className="text-blue-500 font-bold">{currentPath}</span>
                        <span className="text-white ml-1">#</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-red-500 font-bold">guest</span>
                        <span className="text-white">@</span>
                        <span className="text-red-500 font-bold">spydernet</span>
                        <span className="text-white">:</span>
                        <span className="text-blue-500 font-bold">{currentPath}</span>
                        <span className="text-white ml-1">$</span>
                      </div>
                    )}
                    <span className="ml-1">{item.command}</span>
                  </div>
                )}
                {item.output.map((line, j) => (
                  <div key={j} className="whitespace-pre-wrap">
                    {line.includes("\x1b") ? <span dangerouslySetInnerHTML={{ __html: ansiToHtml(line) }} /> : line}
                  </div>
                ))}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center mt-2 relative z-10">
              {getPrompt()}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none ml-1 font-['Hack','DejaVu_Sans_Mono',monospace]"
                autoFocus
                disabled={showAccessGranted || showWelcome}
              />
            </form>
          </div>

          {/* Terminal status bar */}
          <div className="border-t border-green-900/50 p-2 text-xs text-green-400 font-['Hack','DejaVu_Sans_Mono',monospace] flex justify-between bg-black/80">
            <span>[SPYDERNET v2.5.7]</span>
            <span className="animate-pulse cyberpunk-glow">●</span>
            <span>{new Date().toISOString()}</span>
          </div>
        </div>

        {/* Corrosive effect overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-red-900/20"></div>
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        {/* Tetrahedral physics clues - subtle geometric patterns */}
        <div className="absolute inset-0 pointer-events-none z-5 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Tetrahedron wireframe */}
            <g stroke="rgba(57, 255, 20, 0.5)" strokeWidth="0.5" fill="none">
              <path d="M50,20 L20,70 L80,70 Z" /> {/* Front face */}
              <path d="M50,20 L20,70 L50,50 Z" /> {/* Left face */}
              <path d="M50,20 L80,70 L50,50 Z" /> {/* Right face */}
              <path d="M20,70 L80,70 L50,50 Z" /> {/* Bottom face */}
              {/* Golden ratio markers */}
              <circle cx="50" cy="20" r="0.8" fill="rgba(255, 215, 0, 0.8)" />
              <circle cx="20" cy="70" r="0.8" fill="rgba(255, 215, 0, 0.8)" />
              <circle cx="80" cy="70" r="0.8" fill="rgba(255, 215, 0, 0.8)" />
              <circle cx="50" cy="50" r="0.8" fill="rgba(255, 215, 0, 0.8)" />
              {/* Quantum entanglement lines */}
              <path d="M50,20 L50,50" strokeDasharray="1,1" />
              <path d="M20,70 L50,50" strokeDasharray="1,1" />
              <path d="M80,70 L50,50" strokeDasharray="1,1" />
            </g>

            {/* Fibonacci spiral - subtle hint */}
            <path
              d="M50,50 Q60,50 60,40 Q60,30 50,30 Q40,30 40,40 Q40,50 50,50"
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="0.3"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Easter egg flash messages */}
      {showEasterEgg && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 border border-green-500/50 px-4 py-2 rounded text-green-400 font-['Courier_New',monospace] text-sm z-50 cyberpunk-glow">
          {easterEggText}
        </div>
      )}
    </div>
  )
}

// Helper function to convert ANSI color codes to HTML
function ansiToHtml(text: string): string {
  // Replace ANSI color codes with HTML span tags
  return text
    .replace(/\x1b\[1;34m([^\x1b]*)\x1b\[0m/g, '<span class="text-blue-500 font-bold">$1</span>')
    .replace(/\x1b\[34m([^\x1b]*)\x1b\[0m/g, '<span class="text-blue-500">$1</span>')
    .replace(/\x1b\[1;31m([^\x1b]*)\x1b\[0m/g, '<span class="text-red-500 font-bold">$1</span>')
    .replace(/\x1b\[31m([^\x1b]*)\x1b\[0m/g, '<span class="text-red-500">$1</span>')
    .replace(/\x1b\[1;32m([^\x1b]*)\x1b\[0m/g, '<span class="text-green-500 font-bold">$1</span>')
    .replace(/\x1b\[32m([^\x1b]*)\x1b\[0m/g, '<span class="text-green-500">$1</span>')
    .replace(/\x1b\[1;33m([^\x1b]*)\x1b\[0m/g, '<span class="text-yellow-500 font-bold">$1</span>')
    .replace(/\x1b\[33m([^\x1b]*)\x1b\[0m/g, '<span class="text-yellow-500">$1</span>')
    .replace(/\x1b\[1;37m([^\x1b]*)\x1b\[0m/g, '<span class="text-white font-bold">$1</span>')
    .replace(/\x1b\[37m([^\x1b]*)\x1b\[0m/g, '<span class="text-white">$1</span>')
}
