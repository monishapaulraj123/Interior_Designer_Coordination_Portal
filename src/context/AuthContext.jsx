import React, { createContext, useCallback, useState } from 'react'

export const AuthContext = createContext(null)

// Frontend-only demo accounts — one per role. There is no backend/database:
// this is purely for demonstrating role-based login/logout, protected
// routes, and role-based navigation/content using React state.
//
// `customerId` / `designerName` / `contractorName` link each demo account
// back to a matching record in sampleData.js so every role only ever sees
// data that's actually theirs (their own project, their own assignments).
export const DEMO_USERS = [
  {
    role: 'admin',
    roleLabel: 'Administrator',
    name: 'Monisha',
    avatarInitial: 'M',
    email: 'admin@idcp.com',
    password: 'idcp123'
  },
  {
    role: 'designer',
    roleLabel: 'Designer',
    name: 'Ananya Rao',
    avatarInitial: 'A',
    email: 'designer@idcp.com',
    password: 'idcp123',
    designerName: 'Ananya Rao'
  },
  {
    role: 'customer',
    roleLabel: 'Customer',
    name: 'Priya Mehta',
    avatarInitial: 'P',
    email: 'customer@idcp.com',
    password: 'idcp123',
    customerId: 1
  },
  {
    role: 'contractor',
    roleLabel: 'Contractor',
    name: 'Mahesh Iyer',
    avatarInitial: 'M',
    email: 'contractor@idcp.com',
    password: 'idcp123',
    contractorName: 'Apex Constructions'
  }
]

export function AuthProvider({ children }) {
  // useState: tracks whether someone is currently "logged in". This lives
  // only in memory, so refreshing the browser resets it back to false —
  // that is expected for a frontend-only demo (no real session/token).
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // useState: the logged-in user's profile (name, role, roleLabel, avatar,
  // and the role-specific link field used to filter data across pages).
  const [user, setUser] = useState(null)

  // useCallback: stable login function. Matches the entered email/password
  // against the demo account list. The role is inferred from the matched
  // account itself, rather than requiring the picked tab to match — this
  // keeps the demo forgiving while the tabs still guide the reviewer.
  const login = useCallback((email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = DEMO_USERS.find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password
    )

    if (matchedUser) {
      setUser(matchedUser)
      setIsAuthenticated(true)
      return matchedUser
    }
    return null
  }, [])

  // useCallback: stable logout function, reused by the Header's profile menu.
  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  const value = { isAuthenticated, user, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
