import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

// Users table (integrates with Clerk)
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Forms table
export const forms = sqliteTable('forms', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  elements: text('elements', { mode: 'json' }).notNull().$type<FormElement[]>(),
  settings: text('settings', { mode: 'json' }).notNull().$type<FormSettings>(),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  responseCount: integer('response_count').default(0).notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Form responses table
export const formResponses = sqliteTable('form_responses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  formId: text('form_id').references(() => forms.id, { onDelete: 'cascade' }).notNull(),
  data: text('data', { mode: 'json' }).notNull().$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// AI generation history table
export const aiGenerations = sqliteTable('ai_generations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  prompt: text('prompt').notNull(),
  generatedForm: text('generated_form', { mode: 'json' }).notNull().$type<FormElement[]>(),
  model: text('model').default('gemini-pro').notNull(),
  tokensUsed: integer('tokens_used'),
  generationTime: integer('generation_time'), // in milliseconds
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Form templates table
export const formTemplates = sqliteTable('form_templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  elements: text('elements', { mode: 'json' }).notNull().$type<FormElement[]>(),
  settings: text('settings', { mode: 'json' }).notNull().$type<FormSettings>(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true).notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// TypeScript types for the schema
export interface FormElement {
  id: string
  type: 'text' | 'email' | 'number' | 'phone' | 'date' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'url' | 'rating'
  label: string
  placeholder?: string
  required: boolean
  helpText?: string
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
}

export interface FormSettings {
  theme: string
  submitMessage: string
  redirectUrl?: string
  allowMultipleSubmissions?: boolean
  requireAuth?: boolean
  collectEmail?: boolean
}

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Form = typeof forms.$inferSelect
export type NewForm = typeof forms.$inferInsert
export type FormResponse = typeof formResponses.$inferSelect
export type NewFormResponse = typeof formResponses.$inferInsert
export type AIGeneration = typeof aiGenerations.$inferSelect
export type NewAIGeneration = typeof aiGenerations.$inferInsert
export type FormTemplate = typeof formTemplates.$inferSelect
export type NewFormTemplate = typeof formTemplates.$inferInsert
