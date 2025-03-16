import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get the patient ID from the query parameters
    const url = new URL(req.url)
    const patientId = url.searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // For demo purposes, we'll return mock data
    const mockReports = [
      {
        id: "report-1",
        code: { text: "Complete Blood Count (CBC)" },
        effectiveDateTime: new Date().toISOString(),
        status: "final",
        result: [
          {
            code: { text: "Hemoglobin" },
            valueQuantity: { value: 14.2, unit: "g/dL" },
            interpretation: [{ text: "Normal" }],
          },
          {
            code: { text: "White Blood Cell Count" },
            valueQuantity: { value: 7.5, unit: "10^3/µL" },
            interpretation: [{ text: "Normal" }],
          },
          {
            code: { text: "Platelet Count" },
            valueQuantity: { value: 350, unit: "10^3/µL" },
            interpretation: [{ text: "Normal" }],
          },
        ],
      },
      {
        id: "report-2",
        code: { text: "Comprehensive Metabolic Panel" },
        effectiveDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "final",
        result: [
          {
            code: { text: "Glucose" },
            valueQuantity: { value: 110, unit: "mg/dL" },
            interpretation: [{ text: "High" }],
          },
          {
            code: { text: "Creatinine" },
            valueQuantity: { value: 0.9, unit: "mg/dL" },
            interpretation: [{ text: "Normal" }],
          },
          {
            code: { text: "Potassium" },
            valueQuantity: { value: 4.1, unit: "mmol/L" },
            interpretation: [{ text: "Normal" }],
          },
        ],
      },
    ]

    // Return the mock reports
    return NextResponse.json({
      reports: mockReports,
      metadata: {
        totalCount: mockReports.length,
        patientId,
      },
    })
  } catch (error) {
    console.error("Error fetching Beaker reports:", error)
    return NextResponse.json({ error: "Failed to fetch Beaker reports" }, { status: 500 })
  }
}

