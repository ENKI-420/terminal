import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

// GET handler to fetch content items
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  const supabase = createClient()

  try {
    let query = supabase.from("content_items").select("*")

    // Filter by type if provided
    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content items" }, { status: 500 })
  }
}

// POST handler to create a new content item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, type } = body

    // Validate required fields
    if (!title || !content || !type) {
      return NextResponse.json({ error: "Title, content, and type are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("content_items").insert([{ title, content, type }]).select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content item" }, { status: 500 })
  }
}

