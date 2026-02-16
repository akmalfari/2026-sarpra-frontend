import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")

  // mock users
  const mockUsers = [
    { email: "admin@example.com", password: "admin123", role: "admin" },
    { email: "user@example.com", password: "user123", role: "user" },
  ]

  const onSubmit = (e) => {
    e.preventDefault()

    const found = mockUsers.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )

    if (!found) {
      setError("Invalid email or password")
      return
    }

    // simpan token dan role (mock)
    localStorage.setItem("token", "mock-token-" + found.role)
    localStorage.setItem("role", found.role)

    // arahkan berdasarkan role
    if (found.role === "admin") {
      navigate("/admin/dashboard", { replace: true })
    } else {
      navigate("/user/dashboard", { replace: true })
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                {error && (
                  <p className="text-sm text-red-600 mt-2" role="alert">
                    {error}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
