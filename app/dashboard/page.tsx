import { notFound } from "next/navigation"

async function fetchDashboardData() {
  try {
    // Simulate a fetch request
    const response = await fetch("https://api.example.com/dashboard", {
      // Add cache: 'no-store' if you want fresh data every request
      // Or use { next: { revalidate: 60 } } to revalidate every 60 seconds
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Log the error
    console.error("Failed to fetch dashboard data:", error)

    // Re-throw the error to be caught by the error boundary
    throw new Error("Failed to load dashboard data. Please try again later.")
  }
}

export default async function DashboardPage() {
  try {
    const data = await fetchDashboardData()

    // If data is not found or invalid, show 404 page
    if (!data || !data.items) {
      notFound()
    }

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {/* Render your dashboard content here */}
        <pre className="bg-muted p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  } catch (error) {
    // This error will be caught by the error.tsx boundary
    throw error
  }
}
