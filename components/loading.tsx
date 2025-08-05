"use client"

import { Loader2, Brain } from "lucide-react"

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
  showLogo?: boolean
}

export default function Loading({ 
  message = "Loading...", 
  size = "md", 
  showLogo = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showLogo && (
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">FormAI</span>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
      
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}
