import type React from "react"
import { debounce } from "lodash"

/**
 * Formats a command output with proper line breaks and escaping
 */
export function formatOutput(output: string): string {
  return output.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Creates a debounced scroll handler to prevent too many updates
 */
export function createScrollHandler(
  outputRef: React.RefObject<HTMLDivElement>,
  scrollLockRef: React.MutableRefObject<boolean>,
  delay = 100,
) {
  return debounce(() => {
    if (!outputRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = outputRef.current
    // Lock scroll to bottom if we're close to the bottom
    scrollLockRef.current = scrollHeight - scrollTop - clientHeight < 50
  }, delay)
}

/**
 * Safely scrolls to the bottom of the terminal output
 */
export function scrollToBottom(outputRef: React.RefObject<HTMLDivElement>) {
  if (!outputRef.current) return

  // Use requestAnimationFrame for smooth scrolling
  requestAnimationFrame(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  })
}

/**
 * Generates a unique ID for terminal history items
 */
export function generateTerminalId(): string {
  return `term-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Parses a command line with support for quotes and flags
 */
export function parseCommandLine(input: string) {
  const regex = /(?:[^\s"']+|"([^"]*)"|'([^']*)')+/g
  const args: string[] = []
  const flags: Record<string, boolean | string> = {}

  let match: RegExpExecArray | null
  while ((match = regex.exec(input)) !== null) {
    const arg = match[1] || match[2] || match[0]

    // Handle flags (--flag, -f, --key=value)
    if (arg.startsWith("--")) {
      const equalPos = arg.indexOf("=")
      if (equalPos > 0) {
        // Handle --key=value
        const key = arg.substring(2, equalPos)
        const value = arg.substring(equalPos + 1)
        flags[key] = value
      } else {
        // Handle --flag
        flags[arg.substring(2)] = true
      }
    } else if (arg.startsWith("-") && arg.length > 1 && !arg.match(/^-\d+$/)) {
      // Handle -f (but not negative numbers like -42)
      for (let i = 1; i < arg.length; i++) {
        flags[arg[i]] = true
      }
    } else {
      args.push(arg)
    }
  }

  return { command: args[0], args: args.slice(1), flags }
}
