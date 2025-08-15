"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Shield, Edit2, Save } from "lucide-react"
import TwoFactorSetup from "@/components/two-factor-setup"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [profile, setProfile] = useState({
    username: "TronUser123",
    email: "user@example.com",
    joinDate: "2024-01-15",
    totalClaims: 1247,
    totalEarned: 0.00234567,
    referrals: 12,
    level: "Silver",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-tronmax-green">Profile</h1>
          <Button onClick={() => setIsEditing(!isEditing)} className="bg-tronmax-green hover:bg-tronmax-green/80">
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tronmax-green flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Member Since</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-tronmax-green" />
                  <span className="text-gray-300">{profile.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tronmax-green flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Account Level</span>
                <Badge className="bg-tronmax-green/20 text-tronmax-green border-tronmax-green">{profile.level}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Claims</span>
                <span className="text-tronmax-green font-semibold">{profile.totalClaims.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Earned</span>
                <span className="text-tronmax-green font-semibold">{profile.totalEarned.toFixed(8)} TRX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Referrals</span>
                <span className="text-tronmax-green font-semibold">{profile.referrals}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green">Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="border-tronmax-green text-tronmax-green hover:bg-tronmax-green/10 bg-transparent"
            >
              Change Password
            </Button>
            <TwoFactorSetup isEnabled={twoFactorEnabled} onStatusChange={setTwoFactorEnabled} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
