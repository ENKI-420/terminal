import type { Message } from "ai"

export interface ChatResponse {
  message: Message
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Function to validate if a message contains sensitive health information
export function containsSensitiveHealthInfo(message: string): boolean {
  // This is a simplified check - in a real application, this would be more comprehensive
  const sensitivePatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{9}\b/, // MRN (Medical Record Number)
    /\bpatient id\b/i,
    /\bphi\b/i, // Protected Health Information
  ]

  return sensitivePatterns.some((pattern) => pattern.test(message))
}

// Function to sanitize messages for HIPAA compliance
export function sanitizeForHIPAA(message: string): string {
  if (containsSensitiveHealthInfo(message)) {
    return "This message contains potentially sensitive health information and has been redacted for HIPAA compliance. Please avoid sharing protected health information (PHI)."
  }
  return message
}

// Function to format genomic data for display
export function formatGenomicData(data: any): string {
  // This would format complex genomic data into a readable format
  // Simplified for this example
  return JSON.stringify(data, null, 2)
}

// Function to generate AI-powered quick reply suggestions
export function generateQuickReplySuggestions(message: string): string[] {
  const content = message.toLowerCase()

  if (content.includes("mutation")) {
    return [
      "Show more details about this mutation",
      "What are the clinical implications?",
      "Compare with normal gene sequence",
    ]
  } else if (content.includes("gene") || content.includes("expression")) {
    return [
      "Show expression levels in detail",
      "How does this affect treatment options?",
      "Are there relevant clinical trials?",
    ]
  } else if (content.includes("treatment") || content.includes("therapy")) {
    return ["What are the side effects?", "Show success rates", "Are there alternative treatments?"]
  }

  return []
}

