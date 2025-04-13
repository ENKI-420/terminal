import { simulateNetworkCommand } from "./network-commands"
import { simulatePentestCommand } from "./pentest-commands"
import { simulateSystemCommand } from "./system-commands"
import { simulateFileCommand } from "./file-commands"

interface CommandOptions {
  workingDirectory: string
  username: string
  hostname: string
  networkEnabled: boolean
  activeConnections: any[]
  contextData: Record<string, any>
}

interface CommandResult {
  output: string
  type: "output" | "error" | "warning" | "info" | "success" | "system"
  exitCode: number
  newWorkingDirectory?: string
  metadata?: Record<string, any>
}

export async function executeCommand(command: string, options: CommandOptions): Promise<CommandResult> {
  const { workingDirectory, username, hostname, networkEnabled, activeConnections, contextData } = options

  // Trim the command
  const trimmedCommand = command.trim()

  // Skip empty commands
  if (!trimmedCommand) {
    return {
      output: "",
      type: "output",
      exitCode: 0,
    }
  }

  // Parse the command and arguments
  const parts = trimmedCommand.split(" ")
  const baseCommand = parts[0]
  const args = parts.slice(1)

  // Handle built-in commands
  if (baseCommand === "cd") {
    return handleCdCommand(args, workingDirectory)
  }

  if (baseCommand === "echo") {
    return {
      output: args.join(" "),
      type: "output",
      exitCode: 0,
    }
  }

  if (baseCommand === "pwd") {
    return {
      output: workingDirectory,
      type: "output",
      exitCode: 0,
    }
  }

  if (baseCommand === "whoami") {
    return {
      output: username,
      type: "output",
      exitCode: 0,
    }
  }

  if (baseCommand === "hostname") {
    return {
      output: hostname,
      type: "output",
      exitCode: 0,
    }
  }

  if (baseCommand === "exit" || baseCommand === "logout") {
    return {
      output: "Logout not supported in this terminal. Use the browser controls to close the tab.",
      type: "warning",
      exitCode: 1,
    }
  }

  // Handle different command categories
  if (["ls", "cat", "touch", "mkdir", "rm", "cp", "mv"].includes(baseCommand)) {
    return simulateFileCommand(baseCommand, args, workingDirectory)
  }

  if (["ssh", "nc", "telnet", "curl", "wget", "ping"].includes(baseCommand)) {
    if (!networkEnabled) {
      return {
        output: "Network functionality is disabled. Enable it in the terminal settings.",
        type: "error",
        exitCode: 1,
      }
    }
    return simulateNetworkCommand(baseCommand, args, activeConnections)
  }

  if (["nmap", "gobuster", "sqlmap", "metasploit", "msfconsole", "hydra", "wpscan", "nikto"].includes(baseCommand)) {
    return simulatePentestCommand(baseCommand, args)
  }

  // Handle system commands
  return simulateSystemCommand(baseCommand, args, contextData)
}

function handleCdCommand(args: string[], currentDirectory: string): CommandResult {
  if (args.length === 0 || args[0] === "~") {
    return {
      output: "",
      type: "output",
      exitCode: 0,
      newWorkingDirectory: "/home/operator",
    }
  }

  const target = args[0]

  // Handle absolute paths
  if (target.startsWith("/")) {
    // Simple validation - in a real app, you'd check if the directory exists
    return {
      output: "",
      type: "output",
      exitCode: 0,
      newWorkingDirectory: target,
    }
  }

  // Handle relative paths
  if (target === "..") {
    // Go up one directory
    const parts = currentDirectory.split("/").filter(Boolean)
    if (parts.length === 0) {
      return {
        output: "",
        type: "output",
        exitCode: 0,
        newWorkingDirectory: "/",
      }
    }

    parts.pop()
    const newDir = parts.length === 0 ? "/" : `/${parts.join("/")}`

    return {
      output: "",
      type: "output",
      exitCode: 0,
      newWorkingDirectory: newDir,
    }
  }

  if (target === ".") {
    // Stay in current directory
    return {
      output: "",
      type: "output",
      exitCode: 0,
      newWorkingDirectory: currentDirectory,
    }
  }

  // Handle other relative paths
  const newDir = currentDirectory === "/" ? `/${target}` : `${currentDirectory}/${target}`

  return {
    output: "",
    type: "output",
    exitCode: 0,
    newWorkingDirectory: newDir,
  }
}
