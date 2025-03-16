export const featureFlags = {
  requireSupabase: true,
  requireOpenAI: true,
  requireEpic: false,
  requireEncryption: true,
}

export const apiConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
  epic: {
    baseUrl: process.env.EPIC_FHIR_BASE_URL,
    clientId: process.env.EPIC_CLIENT_ID,
    redirectUri: process.env.EPIC_REDIRECT_URI,
    scope: "patient.read launch openid fhirUser",
    authorizationEndpoint: process.env.EPIC_AUTH_ENDPOINT,
    tokenEndpoint: process.env.EPIC_TOKEN_ENDPOINT,
  },
}

export function checkConfigStatus() {
  const missing: string[] = []
  const optional: string[] = []

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  if (!process.env.OPENAI_API_KEY) {
    missing.push("OPENAI_API_KEY")
  }

  if (!process.env.ENCRYPTION_KEY) {
    optional.push("ENCRYPTION_KEY")
  }

  const configValid = missing.length === 0
  const allConfigured = missing.length === 0 && optional.length === 0

  return { configValid, missing, optional, allConfigured }
}

