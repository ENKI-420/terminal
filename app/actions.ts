"use server"

import { revalidatePath } from "next/cache"

export async function updateData(formData: FormData) {
  try {
    // Validate input
    const name = formData.get("name")
    if (!name || typeof name !== "string") {
      return { success: false, error: "Name is required" }
    }

    // Process the data
    // For example: await db.update(...)

    // Revalidate the path to update the UI
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Action error:", error)

    // Return a structured error response
    return {
      success: false,
      error: "Failed to update data",
      // Include more details in development
      ...(process.env.NODE_ENV === "development" && {
        details: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}
