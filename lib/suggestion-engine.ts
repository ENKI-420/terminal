export function getSuggestions(input: string, commandHistory: string[]): string[] {
  if (!input.trim()) return []

  // Get base command (first word)
  const baseCommand = input.split(" ")[0]

  // Suggest from command history
  const historySuggestions = commandHistory
    .filter((cmd) => cmd.startsWith(input))
    .filter((cmd, index, self) => self.indexOf(cmd) === index) // Remove duplicates

  // Common commands to suggest
  const commonCommands = [
    "ls",
    "cd",
    "pwd",
    "cat",
    "grep",
    "find",
    "echo",
    "touch",
    "mkdir",
    "rm",
    "cp",
    "mv",
    "chmod",
    "chown",
    "ps",
    "kill",
    "top",
    "htop",
    "ssh",
    "scp",
    "ping",
    "traceroute",
    "curl",
    "wget",
    "netstat",
    "ifconfig",
    "ip",
    "nmap",
    "tcpdump",
    "wireshark",
    "dig",
    "host",
    "whois",
    "git",
    "docker",
    "sudo",
    "apt",
    "yum",
    "dnf",
    "pacman",
    "systemctl",
    "journalctl",
    "tar",
    "zip",
    "unzip",
    "gzip",
    "gunzip",
    "vim",
    "nano",
    "less",
    "more",
    "head",
    "tail",
    "diff",
    "patch",
    "gcc",
    "make",
    "python",
    "python3",
    "node",
    "npm",
    "yarn",
    "clear",
    "history",
    "exit",
    "logout",
    "reboot",
    "shutdown",
  ]

  // Suggest common commands that start with the input
  const commandSuggestions = commonCommands
    .filter((cmd) => cmd.startsWith(baseCommand))
    .map((cmd) => (input.includes(" ") ? `${cmd} ${input.split(" ").slice(1).join(" ")}` : cmd))

  // Command-specific suggestions
  const specificSuggestions = getCommandSpecificSuggestions(input)

  // Combine all suggestions, prioritizing history
  const allSuggestions = [...historySuggestions, ...specificSuggestions, ...commandSuggestions]

  // Remove duplicates and limit to 10 suggestions
  return [...new Set(allSuggestions)].slice(0, 10)
}

function getCommandSpecificSuggestions(input: string): string[] {
  const suggestions: string[] = []

  // Extract command and arguments
  const parts = input.split(" ")
  const command = parts[0]
  const args = parts.slice(1)
  const currentArg = args.length > 0 ? args[args.length - 1] : ""

  // Command-specific suggestions
  switch (command) {
    case "cd":
      // Common directories
      if (args.length <= 1) {
        const dirs = ["/", "/home", "/etc", "/var", "/tmp", "/opt", "/usr", "/bin", "..", "."]
        suggestions.push(...dirs.filter((dir) => dir.startsWith(currentArg)).map((dir) => `cd ${dir}`))
      }
      break

    case "ls":
      // Common ls flags
      if (currentArg.startsWith("-")) {
        const flags = ["-l", "-a", "-la", "-lh", "-lt", "-ltr", "-R"]
        suggestions.push(...flags.filter((flag) => flag.startsWith(currentArg)).map((flag) => `ls ${flag}`))
      }
      break

    case "grep":
      // Common grep flags
      if (currentArg.startsWith("-")) {
        const flags = ["-i", "-r", "-v", "-n", "-E", "-A 2", "-B 2", "-C 2"]
        suggestions.push(...flags.filter((flag) => flag.startsWith(currentArg)).map((flag) => `grep ${flag}`))
      }
      break

    case "find":
      // Common find patterns
      if (args.length >= 1) {
        const patterns = ['-name "*.txt"', "-type f", "-type d", "-exec ls -la {} \\;", "-size +10M", "-mtime -7"]
        suggestions.push(...patterns.map((pattern) => `find ${args[0]} ${pattern}`))
      }
      break

    case "nmap":
      // Common nmap scan types
      const scanTypes = ["-sV -sC", "-p- --min-rate 1000", "-sU -sT", "-A -T4", "-sS -sV -oA scan"]
      suggestions.push(...scanTypes.map((type) => `nmap ${type}`))

      // Add target if none specified
      if (args.length === 0) {
        suggestions.push("nmap localhost", "nmap 127.0.0.1", "nmap 10.0.0.1/24")
      }
      break

    case "ssh":
      // Common SSH options
      if (currentArg.startsWith("-")) {
        const options = ["-p 22", "-i key.pem", "-L 8080:localhost:80", "-v"]
        suggestions.push(...options.filter((opt) => opt.startsWith(currentArg)).map((opt) => `ssh ${opt}`))
      } else if (args.length <= 1) {
        // Common SSH targets
        suggestions.push("ssh user@localhost", "ssh root@10.0.0.1", "ssh -p 2222 admin@server")
      }
      break
  }

  return suggestions
}
