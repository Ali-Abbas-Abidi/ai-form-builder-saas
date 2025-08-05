"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Users, Palette, Brain, Shield, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">FormAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/sign-up")}>Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Build Intelligent Forms with <span className="text-indigo-600">AI Power</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create dynamic, responsive forms with our AI-driven builder. Drag, drop, and let AI enhance your forms with
          smart suggestions and real-time collaboration.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button size="lg" className="px-8 py-3" onClick={() => router.push("/sign-up")}>
            Start Building Free
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for Modern Form Building
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>AI-Powered Builder</CardTitle>
              <CardDescription>
                Let AI suggest form fields, validation rules, and layouts based on your requirements.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                Work together with your team in real-time with live cursors and instant updates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Drag & Drop Builder</CardTitle>
              <CardDescription>
                Intuitive drag-and-drop interface with customizable templates and themes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>Enterprise-grade security with user authentication and data protection.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>
                Lightning-fast form rendering and submission with optimized performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>AI-powered insights and analytics to optimize your form performance.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Build Smarter Forms?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of users creating intelligent forms with FormAI</p>
          <Button size="lg" variant="secondary" className="px-8 py-3" onClick={() => router.push("/sign-up")}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">FormAI</span>
          </div>
          <p className="text-gray-400">© 2024 FormAI. All rights reserved. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  )
}
