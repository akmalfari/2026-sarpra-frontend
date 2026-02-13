import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TypingAnimation } from "@/components/ui/typing-animation"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate("/admin")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-auto min-w-full min-h-full max-w-none object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">

        {/* Typing Animation */}
        <div className="text-center mb-6 text-white">
          <TypingAnimation className="text-4xl font-bold">
            SARPR A Admin
          </TypingAnimation>
          <p className="text-muted-foreground mt-2 text-sm">
            Secure Access Portal
          </p>
        </div>

        {/* 💎 Shine Border Card */}
        <Card className="relative bg-background/90 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse blur-xl opacity-20" />

          <CardHeader>
            <CardTitle>Login</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="name@example.com" />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" />
              </div>

              <Button className="w-full mt-4">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
