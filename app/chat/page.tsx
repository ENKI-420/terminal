import type { Metadata } from "next"
import ChatInterface from "@/components/ChatBox"

export const metadata: Metadata = {
  title: "AGENT 2.0 | Genomic Analysis Chat",
  description: "AI-Powered Chatbot for genomic data analysis, oncology research, and Beaker laboratory reports",
}

export default function ChatPage() {
  return (
    <main className="flex flex-col h-screen">
      {/* ChatInterface now includes direct access to Beaker laboratory reports */}
      <ChatInterface />
    </main>
  )
}

