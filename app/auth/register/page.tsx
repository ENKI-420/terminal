import type { Metadata } from "next"
import RegisterClient from "./RegisterClient"

export const metadata: Metadata = {
  title: "Register | GenomicInsights",
  description: "Create a new GenomicInsights account",
}

export default function RegisterPage() {
  return <RegisterClient />
}
