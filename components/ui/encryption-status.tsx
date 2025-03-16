"use client"

import { useState, useEffect } from "react"
import { IconLock } from "@tabler/icons-react"

export function EncryptionStatus() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide the encryption status after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="encryption-status" aria-live="polite">
      <div className="flex items-center justify-center">
        <IconLock className="w-3 h-3 mr-1" />
        <span>Data secured via AES-256 encryption</span>
      </div>
    </div>
  )
}

