import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import VerifyEmail from "../pages/Auth/VerifyEmail"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import Dashboard from "../pages/Dashboard/Dashboard"

export default function AppRouter() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Protected / Dashboard Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        {/* Add more protected routes here */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
