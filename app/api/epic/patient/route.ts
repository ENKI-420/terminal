import { type NextRequest, NextResponse } from "next/server"
import { epicFHIRService } from "@/lib/epic-fhir-service"
import { securityService } from "@/lib/security-service"

export async function GET(req: NextRequest) {
  try {
    // Check if the user is authenticated with Epic FHIR
    if (!epicFHIRService.isAuthenticated()) {
      return NextResponse.json({ error: "Not authenticated with Epic FHIR" }, { status: 401 })
    }

    // Get the patient ID from the query parameters
    const url = new URL(req.url)
    const patientId = url.searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Log the data access for audit purposes
    const userId = req.cookies.get("userId")?.value
    if (userId) {
      await securityService.createAuditTrail(userId, "data_access", "Patient", patientId, { method: "GET" })
    }

    // Fetch patient information
    const patient = await epicFHIRService.getPatient(patientId)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Return the patient information
    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient information" }, { status: 500 })
  }
}

