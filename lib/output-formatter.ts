import { highlight } from "cli-highlight"
import ansiColors from "ansi-colors"

export function formatOutput(output: string, type: string): string {
  if (!output) return output

  // Apply syntax highlighting for common output formats
  if (containsJson(output)) {
    try {
      const jsonObj = JSON.parse(output)
      return highlight(JSON.stringify(jsonObj, null, 2), { language: "json", theme: { string: ansiColors.green } })
    } catch (e) {
      // If parsing fails, continue with other formatting
    }
  }

  if (containsXml(output)) {
    return highlight(output, { language: "xml" })
  }

  if (containsHtml(output)) {
    return highlight(output, { language: "html" })
  }

  // Apply specific formatting based on command output patterns
  if (containsTableData(output)) {
    return formatTableOutput(output)
  }

  if (containsListData(output)) {
    return formatListOutput(output)
  }

  // Apply color highlighting for specific patterns
  let formattedOutput = output

  // Highlight IP addresses
  formattedOutput = formattedOutput.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, (match) => ansiColors.cyan(match))

  // Highlight URLs
  formattedOutput = formattedOutput.replace(/(https?:\/\/[^\s]+)/g, (match) => ansiColors.blue.underline(match))

  // Highlight ports
  formattedOutput = formattedOutput.replace(/\bport (\d+)\b/gi, (match, port) => `port ${ansiColors.yellow(port)}`)

  // Highlight success/failure indicators
  formattedOutput = formattedOutput.replace(/\b(success|successful|succeeded|open|up|running)\b/gi, (match) =>
    ansiColors.green(match),
  )

  formattedOutput = formattedOutput.replace(/\b(error|fail|failed|failure|closed|down|stopped)\b/gi, (match) =>
    ansiColors.red(match),
  )

  formattedOutput = formattedOutput.replace(/\b(warning|warn|caution)\b/gi, (match) => ansiColors.yellow(match))

  // Highlight security-related terms
  formattedOutput = formattedOutput.replace(
    /\b(vulnerability|exploit|attack|breach|hack|malware|virus|trojan|backdoor|ransomware|phishing)\b/gi,
    (match) => ansiColors.red.bold(match),
  )

  // Add line numbers for multi-line output
  if (formattedOutput.includes("\n") && formattedOutput.split("\n").length > 5) {
    formattedOutput = formattedOutput
      .split("\n")
      .map((line, i) => `${ansiColors.dim(String(i + 1).padStart(4))}  ${line}`)
      .join("\n")
  }

  return formattedOutput
}

// Helper functions to detect content types
function containsJson(str: string): boolean {
  return (
    (str.trim().startsWith("{") && str.trim().endsWith("}")) || (str.trim().startsWith("[") && str.trim().endsWith("]"))
  )
}

function containsXml(str: string): boolean {
  return str.includes("<?xml") || (str.includes("<") && str.includes("</") && str.includes(">"))
}

function containsHtml(str: string): boolean {
  return (
    str.includes("<!DOCTYPE html>") ||
    (str.includes("<html") && str.includes("</html>")) ||
    (str.includes("<body") && str.includes("</body>"))
  )
}

function containsTableData(str: string): boolean {
  const lines = str.split("\n")
  if (lines.length < 2) return false

  // Check if there are separator lines (e.g., +----+----+)
  const hasSeparatorLines = lines.some((line) => /^[+|-]{3,}\s*$/.test(line))

  // Check if there are aligned columns
  const hasAlignedColumns = lines.some((line) => {
    const matches = line.match(/\s{2,}/g)
    return matches && matches.length >= 2
  })

  return hasSeparatorLines || hasAlignedColumns
}

function containsListData(str: string): boolean {
  const lines = str.split("\n")
  if (lines.length < 3) return false

  // Check if lines start with common list markers
  const listMarkers = lines.filter(
    (line) => line.trim().startsWith("-") || line.trim().startsWith("*") || line.trim().match(/^\d+\./),
  )

  return listMarkers.length >= 3
}

// Format table-like output
function formatTableOutput(str: string): string {
  const lines = str.split("\n")

  // Identify header line
  const headerIndex = lines.findIndex((line) => line.includes("---") || line.includes("===") || line.includes("+++"))

  if (headerIndex > 0) {
    // Format header row
    lines[headerIndex - 1] = ansiColors.bold.cyan(lines[headerIndex - 1])

    // Format data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Alternate row colors for readability
        lines[i] = i % 2 === 0 ? ansiColors.dim(lines[i]) : lines[i]
      }
    }
  } else {
    // If no clear header, just format alternating rows
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        lines[i] = i % 2 === 0 ? lines[i] : ansiColors.dim(lines[i])
      }
    }
  }

  return lines.join("\n")
}

// Format list-like output
function formatListOutput(str: string): string {
  return str.replace(/^(\s*)(-|\*|\d+\.)\s+(.+)$/gm, (match, indent, marker, content) => {
    return `${indent}${ansiColors.cyan(marker)} ${content}`
  })
}
