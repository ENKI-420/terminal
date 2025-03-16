import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

// GET handler to fetch a specific content item
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("content_items").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Content item not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching content item:", error)
    return NextResponse.json({ error: "Failed to fetch content item" }, { status: 500 })
  }
}

// PUT handler to update a content item
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const body = await request.json()
    const { title, content, type } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("content_items")
      .update({
        title,
        content,
        type: type || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      throw error
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Content item not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating content item:", error)
    return NextResponse.json({ error: "Failed to update content item" }, { status: 500 })
  }
}

// DELETE handler to delete a content item
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const supabase = createClient()

    const { error } = await supabase.from("content_items").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content item:", error)
    return NextResponse.json({ error: "Failed to delete content item" }, { status: 500 })
  }
}

