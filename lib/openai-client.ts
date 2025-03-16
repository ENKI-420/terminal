import { apiConfig } from "./api-config"

// Check if OpenAI is configured
export function isOpenAIConfigured() {
  return Boolean(apiConfig.openai.apiKey)
}

// Safe OpenAI operation
export async function safeOpenAIOperation(operation: () => Promise<any>, fallback: any = null) {
  if (!isOpenAIConfigured()) {
    console.error("OpenAI API key not configured. Check your environment variables.")
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error("OpenAI operation failed:", error)
    return fallback
  }
}

