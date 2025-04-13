/**
 * Safely formats a content URL to ensure it's properly loaded
 */
export function getContentUrl(url: string): string {
  if (!url) return "/placeholder.svg"

  // Handle vusercontent.net URLs
  if (url.includes("vusercontent.net")) {
    // Ensure proper protocol
    if (!url.startsWith("http")) {
      return `https://${url}`
    }

    // Add any required query parameters for proper loading
    if (!url.includes("?")) {
      return `${url}?quality=80`
    }
  }

  return url
}

/**
 * Handles errors when loading content from vusercontent.net
 */
export async function fetchWithContentFallback<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error)

    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, message: ${error.message}`)
      console.error(`Stack trace: ${error.stack}`)
    }

    // Return fallback data or rethrow with more context
    throw new Error(`Failed to load content. Please try again later. URL: ${url}`)
  }
}
