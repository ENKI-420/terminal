interface ParsedCommand {
  command: string
  args: string[]
  flags: Record<string, boolean | string>
  redirects: {
    stdin?: string
    stdout?: string
    stderr?: string
    append: boolean
  }
  pipes: string[]
}

export function parseCommand(commandLine: string): ParsedCommand {
  // Initialize result
  const result: ParsedCommand = {
    command: "",
    args: [],
    flags: {},
    redirects: { append: false },
    pipes: [],
  }

  // Handle empty command
  if (!commandLine.trim()) {
    return result
  }

  // Split by pipes
  const pipeComponents = commandLine.split("|").map((cmd) => cmd.trim())
  result.pipes = pipeComponents.slice(1)

  // Process the main command (before any pipes)
  const mainCommand = pipeComponents[0]

  // Handle redirections
  let cmdWithoutRedirects = mainCommand

  // Output redirection (>)
  const stdoutMatch = mainCommand.match(/(.+?)(?:\s+)?>(?:\s+)?(.+)/)
  if (stdoutMatch) {
    cmdWithoutRedirects = stdoutMatch[1].trim()
    result.redirects.stdout = stdoutMatch[2].trim()
    result.redirects.append = false
  }

  // Output redirection with append (>>)
  const appendMatch = mainCommand.match(/(.+?)(?:\s+)?>>(?:\s+)?(.+)/)
  if (appendMatch) {
    cmdWithoutRedirects = appendMatch[1].trim()
    result.redirects.stdout = appendMatch[2].trim()
    result.redirects.append = true
  }

  // Input redirection (<)
  const stdinMatch = cmdWithoutRedirects.match(/(.+?)(?:\s+)?<(?:\s+)?(.+)/)
  if (stdinMatch) {
    cmdWithoutRedirects = stdinMatch[1].trim()
    result.redirects.stdin = stdinMatch[2].trim()
  }

  // Error redirection (2>)
  const stderrMatch = cmdWithoutRedirects.match(/(.+?)(?:\s+)?2>(?:\s+)?(.+)/)
  if (stderrMatch) {
    cmdWithoutRedirects = stderrMatch[1].trim()
    result.redirects.stderr = stderrMatch[2].trim()
  }

  // Parse the command and arguments
  const parts: string[] = []
  let current = ""
  let inQuotes = false
  let quoteChar = ""

  for (let i = 0; i < cmdWithoutRedirects.length; i++) {
    const char = cmdWithoutRedirects[i]

    if ((char === '"' || char === "'") && (i === 0 || cmdWithoutRedirects[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true
        quoteChar = char
      } else if (char === quoteChar) {
        inQuotes = false
        quoteChar = ""
      } else {
        current += char
      }
    } else if (char === " " && !inQuotes) {
      if (current) {
        parts.push(current)
        current = ""
      }
    } else {
      current += char
    }
  }

  if (current) {
    parts.push(current)
  }

  // Extract command, args, and flags
  if (parts.length > 0) {
    result.command = parts[0]

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]

      if (part.startsWith("--")) {
        // Long flag (--flag or --key=value)
        const equalPos = part.indexOf("=")
        if (equalPos > 0) {
          const key = part.substring(2, equalPos)
          const value = part.substring(equalPos + 1)
          result.flags[key] = value
        } else {
          result.flags[part.substring(2)] = true
        }
      } else if (part.startsWith("-") && part.length > 1 && !/^-\d+$/.test(part)) {
        // Short flag(s) (-a or -abc)
        for (let j = 1; j < part.length; j++) {
          result.flags[part[j]] = true
        }
      } else {
        // Regular argument
        result.args.push(part)
      }
    }
  }

  return result
}
