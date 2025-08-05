"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LandingPage from "@/components/landing-page"
import Loading from "@/components/loading"

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading message="Initializing FormAI..." size="lg" showLogo />
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <main>
      <LandingPage />
    </main>
  )
}
