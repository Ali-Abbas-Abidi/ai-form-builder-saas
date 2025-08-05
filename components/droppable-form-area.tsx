"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableFormElement from "@/components/sortable-form-element"
import type { FormElement } from "@/types/form-types"
import { Plus } from "lucide-react"

interface DroppableFormAreaProps {
  elements: FormElement[]
  selectedElement: FormElement | null
  onSelectElement: (element: FormElement) => void
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void
  onDeleteElement: (id: string) => void
  onDuplicateElement: (id: string) => void
}

export default function DroppableFormArea({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: DroppableFormAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "form-area",
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] p-4 border-2 border-dashed rounded-lg transition-colors ${
        isOver ? "border-indigo-400 bg-indigo-50" : "border-gray-300"
      }`}
    >
      {elements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Plus className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Start building your form</p>
          <p className="text-sm">Drag elements from the palette to get started</p>
        </div>
      ) : (
        <SortableContext items={elements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {elements.map((element) => (
              <SortableFormElement
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                onSelect={() => onSelectElement(element)}
                onUpdate={(updates) => onUpdateElement(element.id, updates)}
                onDelete={() => onDeleteElement(element.id)}
                onDuplicate={() => onDuplicateElement(element.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  )
}
