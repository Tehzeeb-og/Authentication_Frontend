import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { api } from "@/lib/api"

export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Grab the email passed from the Register page via React Router state
  const email = location.state?.email

  useEffect(() => {
    // If a user tries to visit this page directly without registering first, 
    // kick them back to the registration page.
    if (!email) {
      navigate("/register", { replace: true })
    }
  }, [email, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Send the POST request to the verification API with the dynamically grabbed email
      const response = await api.post("verify-email", { email, otp })
      
      console.log("Verification successful:", response.data)
      setSuccess(true)
      
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      console.error("Verification failed:", err)
      setError(err.response?.data?.message || "Verification failed. Please check your OTP and try again.")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Prevent flashing the UI before the useEffect redirect kicks in
  if (!email) return null 

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl border border-gray-100 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-sans">Verify your email</h1>
          <p className="mt-3 text-sm text-gray-500">
            We've sent a verification code to <br/>
            <span className="font-semibold text-gray-900">{email}</span>. <br/>
            Please enter it below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg text-center font-medium">
              Email verified successfully! Redirecting to login...
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                Verification Code
              </label>
              <Input
                id="otp"
                name="otp"
                type="text"
                autoComplete="off"
                required
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors text-center text-lg tracking-widest font-semibold"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || success || !otp}
              className="w-full bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-black/20 rounded-xl h-12 text-base font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : success ? "Verified!" : "Verify Email"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
