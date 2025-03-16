"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"

interface FAQItem {
  id: string
  title: string
  content: string
}

export function FAQSection() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/content?type=faq")

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ items")
        }

        const data = await response.json()
        setFaqItems(data)
      } catch (err) {
        console.error("Error fetching FAQs:", err)
        setError("Failed to load FAQ items")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Unable to load FAQ content</p>
      </div>
    )
  }

  if (faqItems.length === 0) {
    return null // Don't show anything if there are no FAQ items
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto mt-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert max-w-none">{item.content}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </AnimatePresence>
  )
}

