"use client"

import { useState, useEffect } from "react"

interface ContentItem {
  id: string
  title: string
  content: string
  type: string
  created_at: string
  updated_at: string
}

interface UseContentOptions {
  type?: string
  id?: string
  initialData?: ContentItem | ContentItem[]
}

export function useContent({ type, id, initialData }: UseContentOptions = {}) {
  const [data, setData] = useState<ContentItem | ContentItem[] | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      if (initialData) return

      setIsLoading(true)
      setError(null)

      try {
        let url = "/api/content"

        // If ID is provided, fetch a specific content item
        if (id) {
          url = `${url}/${id}`
        }
        // Otherwise, if type is provided, filter by type
        else if (type) {
          url = `${url}?type=${type}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error("Error fetching content:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [id, type, initialData])

  return { data, isLoading, error }
}

