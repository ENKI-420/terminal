import { type NextRequest, NextResponse } from "next/server"
import { epicFHIRService } from "@/lib/epic-fhir-service"
import { genomicService } from "@/lib/genomic-service"
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
      await securityService.createAuditTrail(userId, "data_access", "GenomicData", patientId, { method: "GET" })
    }

    // Fetch genomic observations from Epic FHIR
    const observations = await epicFHIRService.getGenomicObservations(patientId)

    // Process the genomic data
    const genomicReport = await genomicService.processGenomicData(patientId)

    // Return the genomic data
    return NextResponse.json({
      observations,
      report: genomicReport,
    })
  } catch (error) {
    console.error("Error fetching genomic data:", error)
    return NextResponse.json({ error: "Failed to fetch genomic data" }, { status: 500 })
  }
}

