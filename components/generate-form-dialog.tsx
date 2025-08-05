'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Sparkles, Wand2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { FormElement } from '@/lib/db/schema'

interface GenerateFormDialogProps {
  onFormGenerated: (elements: FormElement[], title: string, description: string) => void
  children?: React.ReactNode
}

interface FormGenerationResponse {
  success: boolean
  data?: {
    elements: FormElement[]
    title: string
    description: string
    estimatedTime: string
  }
  error?: string
}

export function GenerateFormDialog({ onFormGenerated, children }: GenerateFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    formType: '',
    targetAudience: '',
    additionalRequirements: ''
  })
  const { toast } = useToast()

  const formTypes = [
    { value: 'contact', label: 'Contact Form' },
    { value: 'survey', label: 'Survey' },
    { value: 'registration', label: 'Registration' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'application', label: 'Application' },
    { value: 'order', label: 'Order Form' },
    { value: 'booking', label: 'Booking' },
    { value: 'newsletter', label: 'Newsletter Signup' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'other', label: 'Other' }
  ]

  const targetAudiences = [
    { value: 'general', label: 'General Public' },
    { value: 'customers', label: 'Customers' },
    { value: 'employees', label: 'Employees' },
    { value: 'students', label: 'Students' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'youth', label: 'Youth' },
    { value: 'businesses', label: 'Businesses' }
  ]

  const handleGenerate = async () => {
    if (!formData.description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a description of the form you want to create.',
        variant: 'destructive'
      })
      return
    }

    if (formData.description.length < 10) {
      toast({
        title: 'Description Too Short',
        description: 'Please provide a more detailed description (at least 10 characters).',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let result: FormGenerationResponse | null = null;
      try {
        result = await response.json();
      } catch (_) {
        // non-JSON response (e.g., redirect or HTML)
      }

      if (!response.ok || !result) {
        throw new Error(result?.error || 'Failed to generate form')
      }

      if (result?.success && result.data) {
        onFormGenerated(result.data.elements, result.data.title, result.data.description)
        setOpen(false)
        setFormData({
          description: '',
          formType: '',
          targetAudience: '',
          additionalRequirements: ''
        })
        
        toast({
          title: 'Form Generated Successfully! ✨',
          description: `Created "${result.data.title}" with ${result.data.elements.length} fields. Estimated completion time: ${result.data.estimatedTime}`,
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating form:', error)
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate form. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            Generate Form with AI
          </DialogTitle>
          <DialogDescription>
            Describe the form you want to create and our AI will generate it for you with appropriate fields, validation, and structure.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Form Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what kind of form you need. For example: 'A customer feedback form for our restaurant with ratings for food quality, service, and atmosphere, plus a comments section.'"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="formType">Form Type</Label>
              <Select value={formData.formType} onValueChange={(value) => setFormData({ ...formData, formType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  {formTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="additionalRequirements">Additional Requirements</Label>
            <Textarea
              id="additionalRequirements"
              placeholder="Any specific requirements, validation rules, or special fields you need..."
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !formData.description.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Form
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
