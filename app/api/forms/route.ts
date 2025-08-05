import { type NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'
import { getUserForms, getUserByClerkId, createUser, createForm } from '@/lib/db'
import type { Form } from '@/types/form-types'
import { z } from 'zod'



const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  elements: z.array(z.any()),
  settings: z.object({
    theme: z.string().default('default'),
    submitMessage: z.string().default('Thank you for your submission!'),
    redirectUrl: z.string().optional(),
    allowMultipleSubmissions: z.boolean().default(false),
    requireAuth: z.boolean().default(false),
    collectEmail: z.boolean().default(false),
  })
})

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const dbUser = await getUserByClerkId(userId)
    if (!dbUser || dbUser.length === 0) {
      return NextResponse.json([])
    }

    const userRecord = dbUser[0]
    const forms = await getUserForms(userRecord.id)
    
    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createFormSchema.parse(body)

    // Get or create user in database
    let dbUser = await getUserByClerkId(userId)
    if (!dbUser || dbUser.length === 0) {
      const { currentUser } = await import('@clerk/nextjs/server')
      const clerkUser = await currentUser()
      
      if (clerkUser) {
        await createUser({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          imageUrl: clerkUser.imageUrl || '',
        })
        dbUser = await getUserByClerkId(userId)
      }
    }

    const userRecord = dbUser?.[0]
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create form in database
    const newForm = await createForm({
      userId: userRecord.id,
      title: validatedData.title,
      description: validatedData.description || '',
      elements: validatedData.elements,
      settings: validatedData.settings,
      status: 'draft',
      responseCount: 0,
      isPublic: false,
    })

    return NextResponse.json(newForm[0])
  } catch (error) {
    console.error('Error creating form:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid form data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to create form' 
    }, { status: 500 })
  }
}
