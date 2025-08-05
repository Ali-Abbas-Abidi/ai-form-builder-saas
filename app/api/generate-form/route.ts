import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { generateFormWithGemini, FormGenerationRequest } from '@/lib/gemini'
import { createAIGeneration, getUserByClerkId, createUser } from '@/lib/db'
import { z } from 'zod'

const generateFormSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  formType: z.string().optional(),
  targetAudience: z.string().optional(),
  additionalRequirements: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Get headers first to avoid the headers() iteration issue
    const headersList = request.headers
    const authHeader = headersList.get('authorization')
    
    // Get user after headers are processed
    const user = await currentUser()
    const userId = user?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }

    const body = await request.json()
    const validatedData = generateFormSchema.parse(body)

    // Get or create user in database
    let dbUser = await getUserByClerkId(userId)
    if (!dbUser || dbUser.length === 0) {
      // Create user if doesn't exist
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

    // Generate form using Gemini API
    const startTime = Date.now()
    const generatedForm = await generateFormWithGemini(validatedData as FormGenerationRequest)
    const endTime = Date.now()

    // Save AI generation to database
    await createAIGeneration({
      userId: userRecord.id,
      prompt: validatedData.description,
      generatedForm: generatedForm.elements,
      model: 'gemini-1.5-flash',
      tokensUsed: generatedForm.tokensUsed || 0,
      generationTime: endTime - startTime,
    })

    return NextResponse.json({
      success: true,
      data: generatedForm
    })

  } catch (error) {
    console.error('Error in generate-form API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate form' 
    }, { status: 500 })
  }
}
