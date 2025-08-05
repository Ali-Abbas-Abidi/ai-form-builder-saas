"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FormElement } from "@/types/form-types"
import { GripVertical, Copy, Trash2, Star } from "lucide-react"

interface SortableFormElementProps {
  element: FormElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormElement>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function SortableFormElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableFormElementProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderFormElement = () => {
    const commonProps = {
      placeholder: element.placeholder || `Enter ${element.label.toLowerCase()}`,
      required: element.required,
    }

    switch (element.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
      case "number":
        return <Input type={element.type} {...commonProps} />

      case "date":
        return <Input type="date" {...commonProps} />

      case "textarea":
        return <Textarea {...commonProps} rows={3} />

      case "select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${element.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {element.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${element.id}-${index}`} />
                <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${element.id}-${index}`} />
                <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
            ))}
          </div>
        )

      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 border rounded-lg transition-all ${
        isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Form Element */}
      <div className="space-y-2 ml-6 mr-16">
        <Label className="text-sm font-medium">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderFormElement()}
      </div>
    </div>
  )
}
