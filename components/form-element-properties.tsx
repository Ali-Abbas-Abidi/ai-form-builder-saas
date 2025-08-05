"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { FormElement } from "@/types/form-types"
import { Plus, X } from "lucide-react"

interface FormElementPropertiesProps {
  element: FormElement | null
  onUpdate: (updates: Partial<FormElement>) => void
}

export default function FormElementProperties({ element, onUpdate }: FormElementPropertiesProps) {
  if (!element) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select an element to edit its properties</p>
        </CardContent>
      </Card>
    )
  }

  const hasOptions = ["select", "radio", "checkbox"].includes(element.type)

  const addOption = () => {
    const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`]
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(element.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = element.options?.filter((_, i) => i !== index) || []
    onUpdate({ options: newOptions })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={element.label} onChange={(e) => onUpdate({ label: e.target.value })} />
        </div>

        {/* Placeholder */}
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={element.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
        </div>

        {/* Required */}
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={element.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor="required">Required</Label>
        </div>

        {/* Help Text */}
        <div className="space-y-2">
          <Label htmlFor="helpText">Help Text</Label>
          <Textarea
            id="helpText"
            value={element.helpText || ""}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            rows={2}
          />
        </div>

        {/* Options for select, radio, checkbox */}
        {hasOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={option} onChange={(e) => updateOption(index, e.target.value)} className="flex-1" />
                  <Button size="sm" variant="ghost" onClick={() => removeOption(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div className="space-y-2">
          <Label>Validation</Label>
          {element.type === "text" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="minLength" className="text-xs">
                  Min Length
                </Label>
                <Input
                  id="minLength"
                  type="number"
                  value={element.validation?.minLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...element.validation,
                        minLength: Number.parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  className="w-20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="maxLength" className="text-xs">
                  Max Length
                </Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={element.validation?.maxLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...element.validation,
                        maxLength: Number.parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
