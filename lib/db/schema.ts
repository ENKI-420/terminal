import { createPool } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { pgTable, serial, text, timestamp, varchar, boolean, jsonb, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Database connection
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
})

// Initialize drizzle with the vercel postgres pool
export const db = drizzle(pool)

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Sessions table for NextAuth
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
})

// Verification tokens for email verification
export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
})

// Enhanced posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: varchar("category", { length: 100 }),
  authorId: varchar("author_id", { length: 64 }).notNull(),
  published: boolean("published").default(true),
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
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Genomic profiles table
export const genomicProfiles = pgTable("genomic_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  cancerType: varchar("cancer_type", { length: 100 }).notNull(),
  mutations:
    jsonb("mutations").$type<
      Array<{
        gene: string
        variant: string
        impact: "High" | "Medium" | "Low"
        frequency: number
        significance: string
      }>
    >(),
  treatmentRecommendations: jsonb("treatment_recommendations"),
  lastAnalysisDate: timestamp("last_analysis_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Clinical trials table
export const clinicalTrials = pgTable("clinical_trials", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(),
  phase: varchar("phase", { length: 20 }),
  eligibilityCriteria: jsonb("eligibility_criteria"),
  contactInfo: jsonb("contact_info"),
  url: varchar("url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// User-trial matches
export const userTrialMatches = pgTable("user_trial_matches", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  trialId: integer("trial_id").notNull(),
  matchScore: integer("match_score").notNull(),
  matchReason: text("match_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Define relationships
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const genomicProfilesRelations = relations(genomicProfiles, ({ one }) => ({
  user: one(users, {
    fields: [genomicProfiles.userId],
    references: [users.id],
  }),
}))

export const userTrialMatchesRelations = relations(userTrialMatches, ({ one }) => ({
  user: one(users, {
    fields: [userTrialMatches.userId],
    references: [users.id],
  }),
  trial: one(clinicalTrials, {
    fields: [userTrialMatches.trialId],
    references: [clinicalTrials.id],
  }),
}))
