import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "@/lib/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // The api instance already has the base URL: http://localhost:3000/auth/
      const response = await api.post("login", { email, password })
      
      // Save the accessToken so it can be used for protected routes and API calls
      localStorage.setItem("token", response.data.accessToken)
      
      console.log("Login successful:", response.data)
      
      // Redirect to the dashboard / protected route
      navigate("/")
    } catch (err) {
      console.error("Login failed:", err)
      // Extract error message from response, or use a fallback
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl border border-gray-100 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-sans">Welcome Back</h1>
          <p className="mt-3 text-sm text-gray-500">Please enter your details to sign in.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-semibold text-gray-700 hover:text-black transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-black/20 rounded-xl h-12 text-base font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-black hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
