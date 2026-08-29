import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="main-layout min-h-screen bg-gray-50 flex flex-col">
      {/* Placeholder for top navigation bar */}
      <header className="bg-white border-b h-16 flex items-center px-6">
        <h1 className="text-xl font-bold">My App</h1>
      </header>

      <div className="flex flex-1">
        {/* Placeholder for sidebar */}
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <nav>
            <ul>
              <li className="mb-2"><a href="/" className="text-black font-medium hover:underline">Dashboard</a></li>
              {/* Add more links */}
            </ul>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
