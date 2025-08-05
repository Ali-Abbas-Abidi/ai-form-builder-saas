export interface FormElement {
  id: string
  type: "text" | "email" | "number" | "phone" | "date" | "textarea" | "select" | "radio" | "checkbox" | "url" | "rating"
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

export interface Form {
  id: string
  title: string
  description: string
  elements: FormElement[]
  settings: FormSettings
  status?: 'draft' | 'published' | 'archived'
  responseCount?: number
  isPublic?: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}
