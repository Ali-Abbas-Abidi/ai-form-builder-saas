"use client"

import { SignUp } from "@clerk/nextjs"
import { Brain } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">FormAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Start building intelligent forms with AI assistance</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
                footerActionLink: "text-indigo-600 hover:text-indigo-700"
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
