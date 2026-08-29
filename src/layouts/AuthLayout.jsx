import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="auth-layout min-h-screen bg-gray-50">
      {/* You could add a shared header, side banner, or footer for all auth pages here */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
