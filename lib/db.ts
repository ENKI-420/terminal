import { createPool } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { pgTable, serial, text, timestamp, varchar, boolean, jsonb } from "drizzle-orm/pg-core"

// Database connection using @vercel/postgres
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
})

// Initialize drizzle with the vercel postgres pool
export const db = drizzle(pool)

// Define schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  featureType: varchar("feature_type", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).unique().notNull(),
  userId: varchar("user_id", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
})

// Updated posts table schema with attachments
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  authorId: varchar("author_id", { length: 64 }),
  published: boolean("published").default(true),
  // New fields for attachments
  featuredImage: varchar("featured_image", { length: 255 }),
  attachments:
    jsonb("attachments").$type<
      Array<{
        name: string
        url: string
        type: string
        size?: number
      }>
    >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Helper functions
export async function saveMessage(sessionId: string, featureType: string, role: string, content: string) {
  try {
    await db.insert(chatMessages).values({
      sessionId,
      featureType,
      role,
      content,
    })
    return true
  } catch (error) {
    console.error("Error saving message:", error)
    return false
  }
}

export async function getSessionMessages(sessionId: string, featureType: string) {
  try {
    return await db
      .select()
      .from(chatMessages)
      .where(({ and, eq }) => and(eq(chatMessages.sessionId, sessionId), eq(chatMessages.featureType, featureType)))
      .orderBy(chatMessages.createdAt)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function createOrUpdateSession(sessionId: string, userId?: string) {
  try {
    const existingSession = await db
      .select()
      .from(userSessions)
      .where(({ eq }) => eq(userSessions.sessionId, sessionId))
      .limit(1)

    if (existingSession.length > 0) {
      await db
        .update(userSessions)
        .set({ lastActive: new Date() })
        .where(({ eq }) => eq(userSessions.sessionId, sessionId))
    } else {
      await db.insert(userSessions).values({
        sessionId,
        userId,
        lastActive: new Date(),
      })
    }
    return true
  } catch (error) {
    console.error("Error managing session:", error)
    return false
  }
}

// Posts helper functions
export async function getAllPosts() {
  try {
    return await db
      .select()
      .from(posts)
      .where(({ eq }) => eq(posts.published, true))
      .orderBy(posts.createdAt, "desc")
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostById(id: number) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(({ eq }) => eq(posts.id, id))
      .limit(1)

    return result[0] || null
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error)
    return null
  }
}

export async function getPostsByCategory(category: string) {
  try {
    return await db
      .select()
      .from(posts)
      .where(({ and, eq }) => and(eq(posts.category, category), eq(posts.published, true)))
      .orderBy(posts.createdAt, "desc")
  } catch (error) {
    console.error(`Error fetching posts in category ${category}:`, error)
    return []
  }
}

// Raw query function for direct SQL execution
export async function executeRawQuery(query: string, params: any[] = []) {
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error executing raw query:", error)
    throw error
  } finally {
    client.release()
  }
}

// Re-export the db and schema from the schema file
export * from "@/lib/db/schema"
