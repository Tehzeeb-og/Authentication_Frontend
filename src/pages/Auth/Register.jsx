import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Send the POST request to the register API
      const response = await api.post("register", { username, email, password })
      
      console.log("Registration successful:", response.data)
      setSuccess(true)
      toast.success("Registration successful! Redirecting to verification...")
      
      // Store in localStorage so the verify page survives a page refresh
      localStorage.setItem("verificationEmail", email)
      if (response.data.otpExpiresAt) {
        localStorage.setItem("otpExpiresAt", response.data.otpExpiresAt)
      }
      
      // Give the user a moment to see the success message, then redirect to login
      // Navigate to OTP verification page, passing the email and expiration time in state
      setTimeout(() => {
        navigate("/verify-email", { state: { email: email, otpExpiresAt: response.data.otpExpiresAt } })
      }, 1500)
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl border border-gray-100 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-sans">Create an Account</h1>
          <p className="mt-3 text-sm text-gray-500">Sign up to get started.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors"
              />
            </div>

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
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || success}
              className="w-full bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-black/20 rounded-xl h-12 text-base font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : success ? "Success!" : "Sign up"}
            </Button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-black hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
