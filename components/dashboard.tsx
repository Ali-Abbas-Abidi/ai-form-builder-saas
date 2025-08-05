"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Users, BarChart3, Settings, Brain, LogOut, User } from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface DashboardProps {
  onSignOut?: () => void
  onNavigate?: (view: "dashboard" | "builder" | "forms") => void
  user?: any
}

export default function Dashboard({ onSignOut, onNavigate }: DashboardProps) {
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    if (onSignOut) onSignOut()
    router.push("/")
  }

  const handleNavigation = (view: "dashboard" | "builder" | "forms") => {
    if (onNavigate) {
      onNavigate(view)
    } else {
      // Default navigation behavior
      if (view === "builder") {
        router.push("/dashboard/builder")
      } else if (view === "forms") {
        router.push("/dashboard/forms")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">FormAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "User"}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Create and manage your intelligent forms with AI assistance.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleNavigation("builder")}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">New Form</CardTitle>
              </div>
              <CardDescription>Create a new form with AI assistance</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleNavigation("forms")}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">My Forms</CardTitle>
              </div>
              <CardDescription>View and edit your existing forms</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Collaborations</CardTitle>
              </div>
              <CardDescription>Forms shared with your team</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Analytics</CardTitle>
              </div>
              <CardDescription>View form performance insights</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Forms */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Forms</CardTitle>
              <CardDescription>Your latest form creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Customer Feedback Form", responses: 24, created: "2 days ago" },
                  { name: "Event Registration", responses: 156, created: "1 week ago" },
                  { name: "Product Survey", responses: 89, created: "2 weeks ago" },
                ].map((form, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{form.name}</h4>
                      <p className="text-sm text-gray-500">
                        {form.responses} responses • {form.created}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Smart recommendations for your forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-indigo-900">Optimize Response Rate</h4>
                      <p className="text-sm text-indigo-700 mt-1">
                        Consider adding progress indicators to your multi-step forms to increase completion rates by up
                        to 30%.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Smart Field Suggestions</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Based on your form patterns, consider adding email validation to improve data quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
