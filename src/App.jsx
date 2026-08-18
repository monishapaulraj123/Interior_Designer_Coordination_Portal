import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Customers from './pages/Customers.jsx'
import Projects from './pages/Projects.jsx'
import Materials from './pages/Materials.jsx'
import Quotations from './pages/Quotations.jsx'
import Designers from './pages/Designers.jsx'
import Contractors from './pages/Contractors.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Appointments from './pages/Appointments.jsx'
import Payments from './pages/Payments.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

// The Login page has its own full-screen split layout (no sidebar/header),
// while every other page shares the Sidebar + Header shell. Reading the
// current URL here lets us switch between the two without duplicating
// <BrowserRouter> or losing client-side (no full-refresh) navigation.
function AppContent() {
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'

  if (isLoginRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        {/* Routes/Route: maps each URL path to its page component.
            Every protected page is wrapped in <ProtectedRoute>, which
            redirects back to /login if the admin isn't signed in. */}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute roles={['admin', 'designer']}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <ProtectedRoute roles={['admin', 'designer', 'contractor']}>
                <Materials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations"
            element={
              <ProtectedRoute roles={['admin', 'designer', 'customer']}>
                <Quotations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designers"
            element={
              <ProtectedRoute roles={['admin']}>
                <Designers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractors"
            element={
              <ProtectedRoute roles={['admin']}>
                <Contractors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute roles={['admin']}>
                <Suppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute roles={['admin', 'customer']}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Catch-all: any unknown path shows the 404 page. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          {/* BrowserRouter: enables client-side navigation (no full page
              refresh) between every page in the app, including /login. */}
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
