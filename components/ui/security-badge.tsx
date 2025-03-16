import { IconLock, IconShieldLock } from "@tabler/icons-react"

interface SecurityBadgeProps {
  type: "encryption" | "hipaa" | "audit"
  className?: string
}

export function SecurityBadge({ type, className = "" }: SecurityBadgeProps) {
  let icon = <IconLock className="w-3 h-3 mr-1" />
  let text = "Encrypted"

  if (type === "hipaa") {
    icon = <IconShieldLock className="w-3 h-3 mr-1" />
    text = "HIPAA Compliant"
  } else if (type === "audit") {
    icon = <IconShieldLock className="w-3 h-3 mr-1" />
    text = "Audit Logged"
  }

  return (
    <div className={`security-badge ${className}`} aria-label={`Security: ${text}`}>
      {icon}
      <span>{text}</span>
    </div>
  )
}

