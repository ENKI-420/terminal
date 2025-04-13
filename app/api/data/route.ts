import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Your data fetching logic here
    // For example:
    // const data = await fetchSomeData()

    // Simulate successful response
    return NextResponse.json({ success: true, data: { message: "Data loaded successfully" } })
  } catch (error) {
    console.error("API error:", error)

    // Return a proper error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data",
        // Include the digest in development mode only
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 },
    )
  }
}
