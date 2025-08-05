"use client"

import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Type, Mail, Phone, Calendar, ToggleLeft, List, CheckSquare, FileText, Hash, Link, Star } from "lucide-react"

const formElements = [
  { id: "text", label: "Text Input", icon: Type },
  { id: "email", label: "Email", icon: Mail },
  { id: "number", label: "Number", icon: Hash },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "date", label: "Date", icon: Calendar },
  { id: "textarea", label: "Text Area", icon: FileText },
  { id: "select", label: "Dropdown", icon: List },
  { id: "radio", label: "Radio", icon: ToggleLeft },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "url", label: "URL", icon: Link },
  { id: "rating", label: "Rating", icon: Star },
]

function DraggableElement({ id, label, icon: Icon }: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <Button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      variant="ghost"
      className={`w-full justify-start p-3 h-auto mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span className="text-sm">{label}</span>
    </Button>
  )
}

export default function FormElementPalette() {
  return (
    <div className="space-y-1">
      {formElements.map((element) => (
        <DraggableElement key={element.id} id={element.id} label={element.label} icon={element.icon} />
      ))}
    </div>
  )
}
