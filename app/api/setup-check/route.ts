import { NextResponse } from "next/server"
import { checkConfigStatus, featureFlags } from "@/lib/api-config"
import { isSupabaseConfigured } from "@/lib/supabase-client"
import { isOpenAIConfigured } from "@/lib/openai-client"

export async function GET() {
  const configStatus = checkConfigStatus()

  const status = {
    configValid: configStatus.configValid,
    services: {
      supabase: isSupabaseConfigured(),
      supabaseRequired: featureFlags.requireSupabase,
      openai: isOpenAIConfigured(),
      openaiRequired: featureFlags.requireOpenAI,
      epic: Boolean(process.env.EPIC_CLIENT_ID),
      epicRequired: featureFlags.requireEpic,
      encryption: Boolean(process.env.ENCRYPTION_KEY),
      encryptionRequired: featureFlags.requireEncryption,
    },
    missingRequired: configStatus.missing,
    missingOptional: configStatus.optional,
    allConfigured: configStatus.allConfigured,
    featureFlags,
  }

  return NextResponse.json(status)
}

