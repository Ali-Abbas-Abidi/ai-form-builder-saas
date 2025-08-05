import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('./sqlite.db')
export const db = drizzle(sqlite, { schema })

// Helper functions for database operations
export async function createUser(userData: schema.NewUser) {
  return db.insert(schema.users).values(userData).returning()
}

export async function getUserByClerkId(clerkId: string) {
  return db.select().from(schema.users).where(eq(schema.users.clerkId, clerkId)).limit(1)
}

export async function createForm(formData: schema.NewForm) {
  return db.insert(schema.forms).values(formData).returning()
}

export async function getUserForms(userId: string) {
  return db.select().from(schema.forms).where(eq(schema.forms.userId, userId)).orderBy(desc(schema.forms.updatedAt))
}

export async function getFormById(formId: string) {
  return db.select().from(schema.forms).where(eq(schema.forms.id, formId)).limit(1)
}

export async function updateForm(formId: string, updates: Partial<schema.NewForm>) {
  return db.update(schema.forms).set({
    ...updates,
    updatedAt: new Date()
  }).where(eq(schema.forms.id, formId)).returning()
}

export async function deleteForm(formId: string) {
  return db.delete(schema.forms).where(eq(schema.forms.id, formId))
}

export async function createFormResponse(responseData: schema.NewFormResponse) {
  return db.insert(schema.formResponses).values(responseData).returning()
}

export async function getFormResponses(formId: string) {
  return db.select().from(schema.formResponses).where(eq(schema.formResponses.formId, formId)).orderBy(desc(schema.formResponses.submittedAt))
}

export async function createAIGeneration(generationData: schema.NewAIGeneration) {
  return db.insert(schema.aiGenerations).values(generationData).returning()
}

export async function getUserAIGenerations(userId: string) {
  return db.select().from(schema.aiGenerations).where(eq(schema.aiGenerations.userId, userId)).orderBy(desc(schema.aiGenerations.createdAt))
}

export async function getFormTemplates() {
  return db.select().from(schema.formTemplates).where(eq(schema.formTemplates.isPublic, true)).orderBy(desc(schema.formTemplates.usageCount))
}

// Import required operators
import { eq, desc } from 'drizzle-orm'

export { schema }
