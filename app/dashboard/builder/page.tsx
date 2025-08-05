"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import FormBuilder from "@/components/form-builder"
import { Loader2 } from "lucide-react"

export default function FormBuilderPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

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
    router.push("/sign-in")
    return null
  }

  return <FormBuilder onBack={() => router.push("/dashboard")} />
}
