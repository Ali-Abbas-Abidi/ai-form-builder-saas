"use client"

import { useState, useCallback } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Eye, Brain, Users, Sparkles, Download as DownloadIcon } from "lucide-react"
import FormElementPalette from "@/components/form-element-palette"
import DroppableFormArea from "@/components/droppable-form-area"
import FormElementProperties from "@/components/form-element-properties"
import AIAssistant from "@/components/ai-assistant"
import { GenerateFormDialog } from "@/components/generate-form-dialog"
import type { FormElement } from "@/types/form-types"

interface FormBuilderProps {
  onBack: () => void
}

export default function FormBuilder({ onBack }: FormBuilderProps) {
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  const handleDownload = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(formTitle || 'Untitled Form', 10, 20);

    // Description
    doc.setFontSize(12);
    if (formDescription) {
      doc.text(formDescription, 10, 30);
    }

    // Elements
    let y = formDescription ? 40 : 35;
    formElements.forEach((el, idx) => {
      const label = `${idx + 1}. ${el.label} (${el.type})${el.required ? ' *' : ''}`;
      doc.text(label, 10, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${formTitle.replace(/\s+/g, '_').toLowerCase() || 'form'}.pdf`);
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    if (over.id === "form-area") {
      // Adding new element from palette
      const elementType = active.id as string
      const newElement: FormElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType as any,
        label: `New ${elementType}`,
        required: false,
        placeholder: "",
        options:
          elementType === "select" || elementType === "radio" || elementType === "checkbox"
            ? ["Option 1", "Option 2"]
            : undefined,
      }
      setFormElements((prev) => [...prev, newElement])
    }
  }

  const updateElement = useCallback(
    (id: string, updates: Partial<FormElement>) => {
      setFormElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
      if (selectedElement?.id === id) {
        setSelectedElement((prev) => (prev ? { ...prev, ...updates } : null))
      }
    },
    [selectedElement],
  )

  const deleteElement = useCallback(
    (id: string) => {
      setFormElements((prev) => prev.filter((el) => el.id !== id))
      if (selectedElement?.id === id) {
        setSelectedElement(null)
      }
    },
    [selectedElement],
  )

  const duplicateElement = useCallback(
    (id: string) => {
      const element = formElements.find((el) => el.id === id)
      if (element) {
        const newElement = { ...element, id: `${element.type}-${Date.now()}` }
        setFormElements((prev) => [...prev, newElement])
      }
    },
    [formElements],
  )

  const handleFormGenerated = useCallback(
    (elements: FormElement[], title: string, description: string) => {
      setFormElements(elements)
      setFormTitle(title)
      setFormDescription(description)
      setSelectedElement(null)
    },
    [],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                  placeholder="Form Title"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <GenerateFormDialog onFormGenerated={handleFormGenerated}>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </GenerateFormDialog>
              <Button variant="outline" onClick={() => setShowAIAssistant(!showAIAssistant)}>
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Element Palette */}
          <div className="col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm">Form Elements</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FormElementPalette />
                  <DragOverlay>
                    {activeId ? <div className="p-2 bg-white border rounded shadow-lg">{activeId}</div> : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder Area */}
          <div className={`${showAIAssistant ? "col-span-6" : "col-span-7"}`}>
            <Card className="h-full">
              <CardHeader>
                <div className="space-y-2">
                  <Textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Form description (optional)"
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <DroppableFormArea
                    elements={formElements}
                    selectedElement={selectedElement}
                    onSelectElement={setSelectedElement}
                    onUpdateElement={updateElement}
                    onDeleteElement={deleteElement}
                    onDuplicateElement={duplicateElement}
                  />
                  <DragOverlay>
                    {activeId ? <div className="p-2 bg-white border rounded shadow-lg">{activeId}</div> : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant */}
          {showAIAssistant && (
            <div className="col-span-3">
              <AIAssistant
                formElements={formElements}
                onAddElement={(element) => setFormElements((prev) => [...prev, element])}
                onSuggestImprovement={(suggestions) => {
                  // Handle AI suggestions
                  console.log("AI Suggestions:", suggestions)
                }}
              />
            </div>
          )}

          {/* Properties Panel */}
          <div className={`${showAIAssistant ? "col-span-3" : "col-span-3"}`}>
            <FormElementProperties
              element={selectedElement}
              onUpdate={(updates) => {
                if (selectedElement) {
                  updateElement(selectedElement.id, updates)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
