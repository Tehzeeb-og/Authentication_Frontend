import { Navigate, useLocation } from "react-router-dom"

/**
 * A wrapper for routes that require authentication.
 * Eventually, you will check your auth state (e.g., from Redux or Context) here.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  // Check if a token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token")
  const userRole = "user"
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If the user doesn't have the right role, maybe redirect to an unauthorized page or home
    return <Navigate to="/" replace />
  }

  return children
}
