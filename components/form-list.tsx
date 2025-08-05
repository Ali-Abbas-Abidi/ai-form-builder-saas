"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, Eye, Edit, Trash2, Share, BarChart3 } from "lucide-react"

interface FormListProps {
  onBack: () => void
}

interface Form {
  id: string
  title: string
  description: string
  responses: number
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

const mockForms: Form[] = [
  {
    id: "1",
    title: "Customer Feedback Survey",
    description: "Collect feedback from customers about our products and services",
    responses: 156,
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Event Registration Form",
    description: "Registration form for the annual company conference",
    responses: 89,
    status: "published",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Employee Onboarding",
    description: "New employee information collection form",
    responses: 12,
    status: "draft",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: "4",
    title: "Product Feature Request",
    description: "Allow users to submit feature requests for our product",
    responses: 234,
    status: "published",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-19",
  },
]

export default function FormList({ onBack }: FormListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [forms] = useState<Form[]>(mockForms)

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: Form["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{form.title}</CardTitle>
                    <CardDescription className="text-sm">{form.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{form.responses} responses</span>
                    <span>Updated {form.updatedAt}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No forms found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
