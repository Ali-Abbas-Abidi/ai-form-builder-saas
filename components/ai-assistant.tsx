"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FormElement } from "@/types/form-types"
import { Brain, Send, Lightbulb, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  formElements: FormElement[]
  onAddElement: (element: FormElement) => void
  onSuggestImprovement: (suggestions: string[]) => void
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function AIAssistant({ formElements, onAddElement, onSuggestImprovement }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI form building assistant. I can help you create better forms, suggest improvements, and generate form elements based on your needs. What would you like to build?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response - In a real app, this would call the Gemini API
      const response = await simulateAIResponse(input, formElements)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Handle AI actions
      if (response.action === "add_element" && response.element) {
        onAddElement(response.element)
        toast({
          title: "Element Added",
          description: "AI has added a new form element based on your request.",
        })
      }

      if (response.action === "suggest_improvements" && response.suggestions) {
        onSuggestImprovement(response.suggestions)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      label: "Analyze Form",
      icon: Brain,
      action: () => setInput("Analyze my current form and suggest improvements"),
    },
    {
      label: "Add Contact Fields",
      icon: Wand2,
      action: () => setInput("Add standard contact form fields"),
    },
    {
      label: "Improve UX",
      icon: Lightbulb,
      action: () => setInput("How can I improve the user experience of this form?"),
    },
  ]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Brain className="h-4 w-4 mr-2" />
          AI Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3">
        {/* Quick Actions */}
        <div className="mb-4">
          <div className="grid gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start h-8 text-xs bg-transparent"
                onClick={action.action}
              >
                <action.icon className="h-3 w-3 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center mb-1">
                      <Brain className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to help with your form..."
            className="flex-1 min-h-[60px] text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="sm" className="self-end">
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Simulate AI response - In a real app, this would call the Gemini API
async function simulateAIResponse(input: string, formElements: FormElement[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("contact") || lowerInput.includes("contact form")) {
    return {
      message:
        "I'll add standard contact form fields for you! I've added Name, Email, Phone, and Message fields to help you collect contact information effectively.",
      action: "add_element",
      element: {
        id: `email-${Date.now()}`,
        type: "email" as const,
        label: "Email Address",
        required: true,
        placeholder: "Enter your email address",
      },
    }
  }

  if (lowerInput.includes("analyze") || lowerInput.includes("improve")) {
    const suggestions = [
      "Consider adding progress indicators for better user experience",
      "Group related fields together for better organization",
      "Add help text to complex fields",
      "Use conditional logic to show/hide relevant fields",
    ]

    return {
      message: `I've analyzed your form with ${formElements.length} elements. Here are some suggestions:\n\n• ${suggestions.join("\n• ")}\n\nWould you like me to implement any of these improvements?`,
      action: "suggest_improvements",
      suggestions,
    }
  }

  if (lowerInput.includes("ux") || lowerInput.includes("user experience")) {
    return {
      message:
        "Here are some UX improvements for your form:\n\n• Use clear, descriptive labels\n• Add placeholder text for guidance\n• Group related fields with sections\n• Provide real-time validation feedback\n• Use appropriate input types for better mobile experience\n• Add progress indicators for multi-step forms\n\nWould you like me to help implement any of these?",
    }
  }

  // Default response
  return {
    message:
      "I can help you with various form building tasks:\n\n• Add new form elements\n• Analyze and improve your form\n• Suggest better field types\n• Optimize for user experience\n• Add validation rules\n\nWhat specific help do you need with your form?",
  }
}
