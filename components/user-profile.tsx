"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Crown } from "lucide-react"

export default function UserProfile() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-16 h-16"
              }
            }}
          />
          <div className="flex-1">
            <CardTitle className="text-xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Mail className="h-4 w-4" />
              <span>{user.primaryEmailAddress?.emailAddress}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
            <Crown className="h-3 w-3 mr-1" />
            Pro User
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Account Created</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(user.createdAt!).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Last Sign In</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{new Date(user.lastSignInAt!).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Email Addresses</h4>
          <div className="space-y-2">
            {user.emailAddresses.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm">{email.emailAddress}</span>
                <div className="flex items-center space-x-2">
                  {email.verification?.status === "verified" && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  )}
                  {user.primaryEmailAddress?.id === email.id && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            Manage Account
          </Button>
          <Button variant="outline" size="sm">
            Security Settings
          </Button>
          <Button variant="outline" size="sm">
            Billing & Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
