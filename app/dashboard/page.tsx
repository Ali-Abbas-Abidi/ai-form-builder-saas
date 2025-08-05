"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import Dashboard from "@/components/dashboard"
import FormBuilder from "@/components/form-builder"
import FormList from "@/components/form-list"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [activeView, setActiveView] = useState<"dashboard" | "builder" | "forms">("dashboard")

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not signed in (shouldn't happen due to middleware, but good fallback)
  if (!isSignedIn) {
    window.location.href = "/sign-in"
    return null
  }

  // Render the appropriate view
  if (activeView === "builder") {
    return <FormBuilder onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "forms") {
    return <FormList onBack={() => setActiveView("dashboard")} />
  }

  return (
    <Dashboard 
      onSignOut={() => window.location.href = "/sign-in"}
      onNavigate={setActiveView}
      user={user}
    />
  )
}
