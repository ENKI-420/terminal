import { createClient } from "@supabase/supabase-js"
import { securityService } from "./security-service"

// Epic FHIR API Service Configuration
interface EpicFHIRConfig {
  baseUrl: string
  clientId: string
  redirectUri: string
  scope: string
  authorizationEndpoint: string
  tokenEndpoint: string
}

// Epic FHIR Authentication Response
interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  refresh_token?: string
  patient?: string
}

// Epic FHIR Service Class
export class EpicFHIRService {
  private supabase
  private config: EpicFHIRConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null
  private refreshToken: string | null = null

  constructor() {
    // Initialize Supabase client for storing tokens securely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    try {
      this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      this.supabase = null
    }

    // Epic FHIR API configuration
    // For sandbox testing, we use the Epic FHIR sandbox endpoints
    // In production, these would be replaced with the actual Epic instance endpoints
    this.config = {
      baseUrl: process.env.EPIC_FHIR_BASE_URL || "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/",
      clientId: process.env.EPIC_CLIENT_ID || "",
      redirectUri: process.env.EPIC_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/epic/callback`,
      scope: "patient.read launch openid fhirUser",
      authorizationEndpoint:
        process.env.EPIC_AUTH_ENDPOINT || "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize",
      tokenEndpoint: process.env.EPIC_TOKEN_ENDPOINT || "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
    }
  }

  // Generate the authorization URL for Epic FHIR OAuth2 flow
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state,
      aud: this.config.baseUrl,
    })

    return `${this.config.authorizationEndpoint}?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<AuthResponse | null> {
    try {
      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
      })

      const response = await fetch(this.config.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}`)
      }

      const data: AuthResponse = await response.json()

      // Store tokens
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token || null

      // Calculate token expiry
      const expiresIn = data.expires_in || 3600 // Default to 1 hour if not specified
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000)

      // Store tokens in Supabase for persistence if available
      if (this.supabase) {
        await this.storeTokens(data)
      }

      return data
    } catch (error) {
      console.error("Error exchanging code for token:", error)
      return null
    }
  }

  // Store tokens securely in Supabase
  private async storeTokens(authResponse: AuthResponse): Promise<void> {
    if (!this.supabase) return

    try {
      // Encrypt tokens before storing
      const encryptedAccessToken = securityService.encryptData(authResponse.access_token)
      const encryptedRefreshToken = authResponse.refresh_token
        ? securityService.encryptData(authResponse.refresh_token)
        : null

      const { error } = await this.supabase.from("epic_tokens").upsert({
        user_id: "current_user", // This would be replaced with the actual user ID in a real app
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: this.tokenExpiry?.toISOString(),
        created_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error storing tokens:", error)
    }
  }

  // Retrieve tokens from Supabase
  async retrieveTokens(userId: string): Promise<boolean> {
    if (!this.supabase) return false

    try {
      const { data, error } = await this.supabase.from("epic_tokens").select("*").eq("user_id", userId).single()

      if (error || !data) return false

      // Check if token is expired
      const expiresAt = new Date(data.expires_at)
      if (expiresAt <= new Date()) {
        // Token is expired, try to refresh
        if (data.refresh_token) {
          const refreshToken = securityService.decryptData(data.refresh_token)
          const refreshed = await this.refreshAccessToken(refreshToken)
          return refreshed
        }
        return false
      }

      // Decrypt and set tokens
      this.accessToken = securityService.decryptData(data.access_token)
      this.refreshToken = data.refresh_token ? securityService.decryptData(data.refresh_token) : null
      this.tokenExpiry = expiresAt

      return true
    } catch (error) {
      console.error("Error retrieving tokens:", error)
      return false
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken?: string): Promise<boolean> {
    try {
      const tokenToUse = refreshToken || this.refreshToken
      if (!tokenToUse) return false

      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenToUse,
        client_id: this.config.clientId,
      })

      const response = await fetch(this.config.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`)
      }

      const data: AuthResponse = await response.json()

      // Update tokens
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token || this.refreshToken

      // Calculate token expiry
      const expiresIn = data.expires_in || 3600
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000)

      // Store updated tokens
      if (this.supabase) {
        await this.storeTokens(data)
      }

      return true
    } catch (error) {
      console.error("Error refreshing access token:", error)
      this.accessToken = null
      this.refreshToken = null
      this.tokenExpiry = null
      return false
    }
  }

  // Check if access token is valid and not expired
  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.tokenExpiry && this.tokenExpiry > new Date()
  }

  // Get the current access token, refreshing if necessary
  async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null

    // Check if token is expired or about to expire (within 5 minutes)
    if (this.tokenExpiry && this.tokenExpiry.getTime() - Date.now() < 5 * 60 * 1000) {
      // Token is expired or about to expire, try to refresh
      if (this.refreshToken) {
        const refreshed = await this.refreshAccessToken()
        if (!refreshed) return null
      } else {
        return null
      }
    }

    return this.accessToken
  }

  // Generic method to fetch data from Epic FHIR API
  async fetchFHIRResource<T>(resourceType: string, id?: string, params?: Record<string, string>): Promise<T | null> {
    try {
      const token = await this.getAccessToken()
      if (!token) {
        throw new Error("Not authenticated")
      }

      let url = `${this.config.baseUrl}${resourceType}`
      if (id) {
        url += `/${id}`
      }

      // Add query parameters
      if (params) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value)
        })
        url += `?${queryParams.toString()}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`FHIR API error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("Error fetching FHIR resource:", error)
      return null
    }
  }

  // Fetch Beaker laboratory reports for a patient
  async getBeakerLaboratoryReports(patientId: string): Promise<any[]> {
    try {
      // Search for Beaker laboratory reports
      // In Epic, Beaker reports are typically DiagnosticReport resources with specific codes
      const params = {
        patient: patientId,
        category: "LAB",
        _sort: "-date",
        _count: "50",
      }

      const result = await this.fetchFHIRResource<{ entry?: Array<{ resource: any }> }>(
        "DiagnosticReport",
        undefined,
        params,
      )

      if (!result?.entry || result.entry.length === 0) {
        return []
      }

      // Filter for Beaker reports
      // This filtering logic will depend on how Beaker reports are identified in the specific Epic implementation
      const beakerReports = result.entry.filter((entry) => {
        const report = entry.resource

        // Check if this is a Beaker report
        // This could be based on:
        // 1. A specific system in the coding
        // 2. A specific code value
        // 3. Text in the report name or category
        const isBeakerReport = report.code?.coding?.some(
          (coding: any) =>
            coding.system?.includes("beaker") ||
            coding.system?.includes("sunquest") ||
            coding.display?.toLowerCase().includes("beaker") ||
            coding.code?.toLowerCase().includes("beaker"),
        )

        return isBeakerReport
      })

      return beakerReports.map((entry) => entry.resource)
    } catch (error) {
      console.error("Error fetching Beaker laboratory reports:", error)
      return []
    }
  }

  // Fetch patient information
  async getPatient(patientId: string): Promise<any | null> {
    return this.fetchFHIRResource<any>("Patient", patientId)
  }

  // Fetch all laboratory reports for a patient
  async getAllLaboratoryReports(patientId: string): Promise<any[]> {
    try {
      const params = {
        patient: patientId,
        category: "LAB",
        _sort: "-date",
        _count: "100",
      }

      const result = await this.fetchFHIRResource<{ entry?: Array<{ resource: any }> }>(
        "DiagnosticReport",
        undefined,
        params,
      )

      if (!result?.entry || result.entry.length === 0) {
        return []
      }

      return result.entry.map((entry) => entry.resource)
    } catch (error) {
      console.error("Error fetching laboratory reports:", error)
      return []
    }
  }

  // Fetch genomic observations for a patient
  async getGenomicObservations(patientId: string): Promise<any[]> {
    try {
      // Search for genomic observations using LOINC codes for genomic findings
      const params = {
        patient: patientId,
        category: "laboratory",
        code: "51969-4,55233-1,82810-3", // LOINC codes for genetic findings
      }

      const result = await this.fetchFHIRResource<{ entry?: Array<{ resource: any }> }>(
        "Observation",
        undefined,
        params,
      )

      if (!result?.entry || result.entry.length === 0) {
        return []
      }

      return result.entry.map((entry) => entry.resource)
    } catch (error) {
      console.error("Error fetching genomic observations:", error)
      return []
    }
  }

  // Logout - clear tokens
  logout(): void {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null

    // Remove tokens from storage if Supabase is available
    if (this.supabase) {
      this.supabase
        .from("epic_tokens")
        .delete()
        .eq("user_id", "current_user")
        .then(({ error }) => {
          if (error) console.error("Error removing tokens:", error)
        })
    }
  }
}

// Export singleton instance
export const epicFHIRService = new EpicFHIRService()

