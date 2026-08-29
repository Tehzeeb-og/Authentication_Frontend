import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("get-me")
        // Based on your backend controller, the user object is returned inside a 'data' property
        setUser(response.data.data || response.data.USER || response.data.user || response.data)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Could not load profile data.")
        // If unauthorized, clear token and kick to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = async () => {
    try {
      // Call the backend logout API to invalidate the session/token on the server side
      await api.get("logout")
    } catch (err) {
      console.error("Logout API failed, but proceeding with local logout:", err)
    } finally {
      // Always clear the local token and redirect, even if the backend call fails
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleLogout} variant="outline">Back to Login</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="text-sm">
          Sign out
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Account Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${user?.verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <p className="font-medium text-gray-900">
                {user?.verified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">User ID</p>
            <p className="font-medium text-gray-900 font-mono text-sm">{user?._id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
