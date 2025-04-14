import type React from "react"
export default function VideoConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>
}
