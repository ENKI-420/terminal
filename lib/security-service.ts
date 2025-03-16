import { createClient } from "@supabase/supabase-js"
import { AES, enc } from "crypto-js"

// Security service for handling sensitive data in compliance with HIPAA
export class SecurityService {
  private supabase
  private encryptionKey: string

  constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    try {
      this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      this.supabase = null
    }

    // Use environment variable for encryption key
    // In production, this should be securely managed and rotated
    this.encryptionKey = process.env.ENCRYPTION_KEY || "default-encryption-key-for-development"
  }

  // Encrypt sensitive data
  encryptData(data: string): string {
    return AES.encrypt(data, this.encryptionKey).toString()
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string): string {
    const bytes = AES.decrypt(encryptedData, this.encryptionKey)
    return bytes.toString(enc.Utf8)
  }

  // Log security event
  async logSecurityEvent(
    eventType: string,
    userId: string,
    details: Record<string, any>,
    success: boolean,
  ): Promise<void> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot log security event")
      return
    }

    try {
      const { error } = await this.supabase.from("security_logs").insert({
        event_type: eventType,
        user_id: userId,
        details,
        success,
        timestamp: new Date().toISOString(),
        ip_address: "client-side", // In a real app, this would be captured server-side
      })

      if (error) throw error
    } catch (error) {
      console.error("Error logging security event:", error)
    }
  }

  // Sanitize PHI (Protected Health Information)
  sanitizePHI(text: string): string {
    // Replace common PHI patterns
    return (
      text
        // SSN
        .replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, "[REDACTED SSN]")
        // MRN (Medical Record Number) - typically 8-10 digits
        .replace(/\b(?:MRN|Medical Record Number)[\s:]?\d{8,10}\b/gi, "[REDACTED MRN]")
        // Phone numbers
        .replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, "[REDACTED PHONE]")
        // Dates of birth
        .replace(/\b(?:DOB|Date of Birth)[\s:]?\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi, "[REDACTED DOB]")
        // Email addresses
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[REDACTED EMAIL]")
        // Names (more complex, would need NLP in production)
        .replace(/\b(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s[A-Z][a-z]+\s[A-Z][a-z]+\b/g, "[REDACTED NAME]")
    )
  }

  // Check if text contains PHI
  containsPHI(text: string): boolean {
    const phiPatterns = [
      /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/, // SSN
      /\b(?:MRN|Medical Record Number)[\s:]?\d{8,10}\b/gi, // MRN
      /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/, // Phone
      /\b(?:DOB|Date of Birth)[\s:]?\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi, // DOB
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ]

    return phiPatterns.some((pattern) => pattern.test(text))
  }

  // Generate audit trail for HIPAA compliance
  async createAuditTrail(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>,
  ): Promise<void> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot create audit trail")
      return
    }

    try {
      const { error } = await this.supabase.from("audit_trails").insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        timestamp: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error creating audit trail:", error)
    }
  }

  // Validate JWT token
  async validateToken(token: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot validate token")
      return false
    }

    try {
      const { data, error } = await this.supabase.auth.getUser(token)
      return !error && !!data.user
    } catch (error) {
      console.error("Error validating token:", error)
      return false
    }
  }

  // Check user permissions
  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot check permission")
      return false
    }

    try {
      const { data, error } = await this.supabase
        .from("user_permissions")
        .select("*")
        .eq("user_id", userId)
        .eq("resource", resource)
        .eq("action", action)
        .single()

      if (error) return false
      return !!data
    } catch (error) {
      console.error("Error checking permission:", error)
      return false
    }
  }
}

// Export singleton instance
export const securityService = new SecurityService()

