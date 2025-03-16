import { type NextRequest, NextResponse } from "next/server"
import { epicFHIRService } from "@/lib/epic-fhir-service"
import { securityService } from "@/lib/security-service"

export async function GET(req: NextRequest) {
  try {
    // Get the authorization code and state from the query parameters
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const error = url.searchParams.get("error")

    // Check if there was an error in the authorization process
    if (error) {
      console.error("Epic FHIR authorization error:", error)
      return NextResponse.redirect(new URL("/auth/login?error=epic_auth_failed", req.url))
    }

    // Verify the code and state are present
    if (!code || !state) {
      console.error("Missing code or state parameter")
      return NextResponse.redirect(new URL("/auth/login?error=missing_params", req.url))
    }

    // Verify the state matches the one we sent
    const storedState = req.cookies.get("epic_auth_state")?.value
    if (!storedState || storedState !== state) {
      console.error("State mismatch, possible CSRF attack")
      return NextResponse.redirect(new URL("/auth/login?error=invalid_state", req.url))
    }

    // Exchange the code for an access token
    const authResponse = await epicFHIRService.exchangeCodeForToken(code)
    if (!authResponse) {
      console.error("Failed to exchange code for token")
      return NextResponse.redirect(new URL("/auth/login?error=token_exchange_failed", req.url))
    }

    // Log the successful authentication for audit purposes
    const userId = req.cookies.get("userId")?.value
    if (userId) {
      await securityService.createAuditTrail(userId, "auth_success", "EpicFHIR", "oauth2", {
        patientId: authResponse.patient,
      })
    }

    // Clear the state cookie
    const response = NextResponse.redirect(new URL("/dashboard", req.url))
    response.cookies.set("epic_auth_state", "", { maxAge: 0, path: "/" })

    // Set a cookie to indicate successful Epic authentication
    response.cookies.set("epic_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error handling Epic FHIR callback:", error)
    return NextResponse.redirect(new URL("/auth/login?error=callback_error", req.url))
  }
}

