"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Shield, Users, FileText } from 'lucide-react'
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock authentication logic
    const mockUsers = [
      { email: "hr@company.com", password: "hr123", role: "hr_manager", name: "Sarah Johnson" },
      { email: "admin@company.com", password: "admin123", role: "admin", name: "John Smith" },
      { email: "recruiter@company.com", password: "rec123", role: "hr_manager", name: "Emily Davis" }
    ]

    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (user && user.role === "hr_manager") {
      // Store user session
      localStorage.setItem("user", JSON.stringify({
        id: Date.now(),
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      }))
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      }

      router.push("/dashboard")
    } else if (user && user.role !== "hr_manager") {
      setError("Access denied. Only HR managers can access this system.")
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Smart Filter</h1>
          <p className="text-gray-600">HR Manager Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access the CV filtering system with your HR manager credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Demo Credentials:</p>
          <div className="grid gap-2 text-xs">
            <div className="bg-white p-3 rounded border">
              <strong>HR Manager:</strong> hr@company.com / hr123
            </div>
            <div className="bg-white p-3 rounded border">
              <strong>Recruiter:</strong> recruiter@company.com / rec123
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Role-Based Access</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Secure Login</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">CV Management</p>
          </div>
        </div>
      </div>
    </div>
  )
}
