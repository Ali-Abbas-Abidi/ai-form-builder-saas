import { GoogleGenerativeAI } from '@google/generative-ai'
import { FormElement } from './db/schema'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface FormGenerationRequest {
  description: string
  formType?: string
  targetAudience?: string
  additionalRequirements?: string
}

export interface FormGenerationResponse {
  elements: FormElement[]
  title: string
  description: string
  estimatedTime: string
  tokensUsed?: number
}

export async function generateFormWithGemini(request: FormGenerationRequest): Promise<FormGenerationResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are an expert form designer. Generate a comprehensive form based on the following requirements:

Description: ${request.description}
Form Type: ${request.formType || 'General'}
Target Audience: ${request.targetAudience || 'General users'}
Additional Requirements: ${request.additionalRequirements || 'None'}

Please create a form with the following specifications:
1. Generate appropriate form elements (text, email, number, phone, date, textarea, select, radio, checkbox, url, rating)
2. Include proper validation rules where appropriate
3. Add helpful placeholder text and help text
4. Make required fields logical and user-friendly
5. Suggest a good form title and description
6. Estimate completion time

Return the response in this exact JSON format:
{
  "title": "Form Title",
  "description": "Form description",
  "estimatedTime": "X minutes",
  "elements": [
    {
      "id": "unique-id",
      "type": "text|email|number|phone|date|textarea|select|radio|checkbox|url|rating",
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "required": true|false,
      "helpText": "Help text for users",
      "options": ["option1", "option2"] // only for select, radio, checkbox
      "validation": {
        "minLength": 2,
        "maxLength": 100,
        "min": 1,
        "max": 10
      }
    }
  ]
}

Make sure the form is practical, user-friendly, and follows best practices for form design. Include 5-15 fields depending on the complexity needed.
`

  try {
    const startTime = Date.now()
    const result = await model.generateContent(prompt)
    const endTime = Date.now()
    
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the response - find the first { and last }
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      throw new Error('Invalid response format from Gemini API')
    }
    
    let jsonString = text.substring(firstBrace, lastBrace + 1)
    
    // Clean the JSON string to handle regex patterns
    // Replace regex patterns that cause JSON parsing issues
    jsonString = jsonString.replace(/"\^\[a-zA-Z\\s\]\+\$"/g, '"^[a-zA-Z\\\\s]+$"') // Fix \s in regex
    jsonString = jsonString.replace(/"\^\[a-zA-Z0-9\]\+\$"/g, '"^[a-zA-Z0-9]+$"') // Fix alphanumeric regex
    
    // Handle other common escape sequences
    jsonString = jsonString.replace(/\\s/g, '\\\\s') // Properly escape \s
    jsonString = jsonString.replace(/\\n/g, '\\\\n') // Properly escape \n
    jsonString = jsonString.replace(/\\r/g, '\\\\r') // Properly escape \r
    jsonString = jsonString.replace(/\\t/g, '\\\\t') // Properly escape \t
    
    let parsedResponse
    try {
      parsedResponse = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Problematic JSON:', jsonString)
      throw new Error('Invalid JSON format from Gemini API')
    }
    
    // Add unique IDs to elements if not present
    parsedResponse.elements = parsedResponse.elements.map((element: any, index: number) => ({
      ...element,
      id: element.id || `element-${Date.now()}-${index}`
    }))
    
    return {
      ...parsedResponse,
      tokensUsed: 0, // Token count not available in this API version
      generationTime: endTime - startTime
    }
  } catch (error) {
    console.error('Error generating form with Gemini:', error)
    throw new Error('Failed to generate form. Please try again.')
  }
}

export async function improveForms(elements: FormElement[], improvementRequest: string): Promise<FormElement[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are an expert form designer. I have an existing form with these elements:

${JSON.stringify(elements, null, 2)}

Please improve this form based on this request: "${improvementRequest}"

Return the improved form elements in this exact JSON format:
{
  "elements": [
    // improved form elements array
  ]
}

Make sure to maintain the same structure and only improve what was requested while keeping the form functional.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API')
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0])
    return parsedResponse.elements
  } catch (error) {
    console.error('Error improving form with Gemini:', error)
    throw new Error('Failed to improve form. Please try again.')
  }
}
