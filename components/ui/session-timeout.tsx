"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { IconClock, IconRefresh } from "@tabler/icons-react"

interface SessionTimeoutProps {
  timeoutMinutes?: number
  onContinue: () => void
  onTimeout: () => void
}

export function SessionTimeout({ timeoutMinutes = 2, onContinue, onTimeout }: SessionTimeoutProps) {
  const [secondsLeft, setSecondsLeft] = useState(timeoutMinutes * 60)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onTimeout])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const handleContinue = () => {
    setVisible(false)
    onContinue()
  }

  if (!visible) return null

  return (
    <div className="session-timeout">
      <div className="session-timeout-content">
        <div className="flex items-center mb-4">
          <IconClock className="w-5 h-5 mr-2 text-destructive" />
          <h3 className="text-lg font-semibold">Session Timeout Warning</h3>
        </div>

        <p className="mb-4">
          Your session will expire in {minutes}:{seconds.toString().padStart(2, "0")} due to inactivity.
        </p>

        <Progress value={(secondsLeft / (timeoutMinutes * 60)) * 100} className="mb-4" />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onTimeout}>
            Logout Now
          </Button>
          <Button onClick={handleContinue}>
            <IconRefresh className="w-4 h-4 mr-2" />
            Continue Session
          </Button>
        </div>
      </div>
    </div>
  )
}

