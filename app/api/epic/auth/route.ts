import { type NextRequest, NextResponse } from "next/server"
import { epicFHIRService } from "@/lib/epic-fhir-service"
import { securityService } from "@/lib/security-service"

// Generate a random state parameter for OAuth2 flow
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function GET(req: NextRequest) {
  try {
    // Generate a random state parameter to prevent CSRF attacks
    const state = generateState()

    // Store the state in a cookie for verification when the user returns
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    }

    // Get the authorization URL
    const authUrl = epicFHIRService.getAuthorizationUrl(state)

    // Create the response with the redirect
    const response = NextResponse.redirect(authUrl)

    // Set the state cookie
    response.cookies.set("epic_auth_state", state, cookieOptions)

    // Log the authentication attempt for audit purposes
    const userId = req.cookies.get("userId")?.value
    if (userId) {
      await securityService.createAuditTrail(userId, "auth_attempt", "EpicFHIR", "oauth2", { state })
    }

    return response
  } catch (error) {
    console.error("Error initiating Epic FHIR authentication:", error)
    return NextResponse.json({ error: "Failed to initiate authentication" }, { status: 500 })
  }
}

