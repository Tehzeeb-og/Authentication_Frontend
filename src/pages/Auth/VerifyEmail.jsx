import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Calculate initial time based on passed state or localStorage, otherwise fallback to 60s
  const initialExpiresAt = location.state?.otpExpiresAt || localStorage.getItem("otpExpiresAt") || null
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (initialExpiresAt) {
      const diff = Math.floor((new Date(initialExpiresAt).getTime() - new Date().getTime()) / 1000)
      return diff > 0 ? diff : 0
    }
    return 60
  })
  const [resendLoading, setResendLoading] = useState(false)

  // Grab the email passed from the Register page via React Router state or localStorage
  const email = location.state?.email || localStorage.getItem("verificationEmail")

  useEffect(() => {
    // If a user tries to visit this page directly without registering first, 
    // kick them back to the registration page.
    if (!email) {
      navigate("/register", { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (success) return
    
    if (expiresAt) {
      // Synchronize with the backend's precise expiration time
      const timerId = setInterval(() => {
        const diff = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / 1000)
        if (diff <= 0) {
          setTimeLeft(0)
          clearInterval(timerId)
        } else {
          setTimeLeft(diff)
        }
      }, 1000)
      return () => clearInterval(timerId)
    } else {
      // Fallback simple countdown if no expiration time was provided
      const timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerId)
    }
  }, [expiresAt, success])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError("")
    
    try {
      const response = await api.post("resend-otp", { email })
      toast.success(response.data.message || "OTP resent successfully. Please check your email.")
      
      if (response.data.otpExpiresAt) {
        localStorage.setItem("otpExpiresAt", response.data.otpExpiresAt)
        setExpiresAt(response.data.otpExpiresAt)
        const diff = Math.floor((new Date(response.data.otpExpiresAt).getTime() - new Date().getTime()) / 1000)
        setTimeLeft(diff > 0 ? diff : 0)
      } else {
        localStorage.removeItem("otpExpiresAt")
        setExpiresAt(null)
        setTimeLeft(60)
      }
      
      setOtp("") // Clear input
    } catch (err) {
      console.error("Resend failed:", err)
      toast.error(err.response?.data?.message || "Failed to resend OTP. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Send the POST request to the verification API with the dynamically grabbed email
      const response = await api.post("verify-email", { email, otp })
      
      console.log("Verification successful:", response.data)
      setSuccess(true)
      toast.success("Email verified successfully! Redirecting...")
      
      // Clean up localStorage
      localStorage.removeItem("verificationEmail")
      localStorage.removeItem("otpExpiresAt")

      // If the backend returns an access token upon verification, log the user in automatically
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        // Otherwise, redirect to login
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
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
      <div className="relative w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl border border-gray-100 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate("/register")}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-900 transition-colors"
          title="Back to Registration"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
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

          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <span className={`text-sm font-medium ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Input
                id="otp"
                name="otp"
                type="text"
                autoComplete="off"
                required
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={timeLeft === 0 || loading || success}
                className="w-full bg-gray-50/50 border-gray-200 focus:border-black focus:ring-black h-12 px-4 rounded-xl transition-colors text-center text-lg tracking-widest font-semibold disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || success || !otp || timeLeft === 0}
              className="w-full bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-black/20 rounded-xl h-12 text-base font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {timeLeft === 0 ? "Code Expired" : loading ? "Verifying..." : success ? "Verified!" : "Verify Email"}
            </Button>
          </div>

          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-black font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResend}
                disabled={resendLoading || timeLeft > 0 || success}
              >
                {resendLoading ? "Resending..." : timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : "Resend Code"}
              </button>
            </p>
            {timeLeft === 0 && (
              <p className="text-sm text-gray-500">
                Wrong email?{" "}
                <button
                  type="button"
                  className="text-black font-semibold hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Sign up again
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
