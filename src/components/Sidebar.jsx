import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  MdDashboard,
  MdPeople,
  MdDesignServices,
  MdEngineering,
  MdLocalShipping,
  MdWork,
  MdInventory2,
  MdEvent,
  MdRequestQuote,
  MdPayments,
  MdBarChart,
  MdSettings
} from 'react-icons/md'
import { GiFlowerPot } from 'react-icons/gi'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { key: 'dashboard', path: '/dashboard', icon: MdDashboard },
  { key: 'customers', path: '/customers', icon: MdPeople },
  { key: 'designers', path: '/designers', icon: MdDesignServices },
  { key: 'contractors', path: '/contractors', icon: MdEngineering },
  { key: 'suppliers', path: '/suppliers', icon: MdLocalShipping },
  { key: 'projects', path: '/projects', icon: MdWork },
  { key: 'materials', path: '/materials', icon: MdInventory2 },
  { key: 'appointments', path: '/appointments', icon: MdEvent },
  { key: 'quotations', path: '/quotations', icon: MdRequestQuote },
  { key: 'payments', path: '/payments', icon: MdPayments },
  { key: 'reports', path: '/reports', icon: MdBarChart },
  { key: 'settings', path: '/settings', icon: MdSettings }
]

// Which sidebar items each role is allowed to see. Keep this list in sync
// with the `roles` prop on each protected <Route> in App.jsx, so a role
// never sees a link it isn't actually allowed to open.
const ROLE_NAV_KEYS = {
  admin: NAV_ITEMS.map((item) => item.key),
  designer: ['dashboard', 'customers', 'projects', 'materials', 'appointments', 'quotations', 'settings'],
  customer: ['dashboard', 'projects', 'quotations', 'payments', 'appointments', 'settings'],
  contractor: ['dashboard', 'projects', 'materials', 'appointments', 'settings']
}

export default function Sidebar() {
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)

  // Falls back to the full admin list if, for any reason, there's no user
  // yet (Sidebar only ever renders behind ProtectedRoute, so this is just
  // a safe default rather than something that should normally happen).
  const allowedKeys = ROLE_NAV_KEYS[user?.role] || ROLE_NAV_KEYS.admin
  const visibleNavItems = NAV_ITEMS.filter((item) => allowedKeys.includes(item.key))

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <GiFlowerPot />
        </div>
        <div className="sidebar-brand-text">
          <h1>IDCP</h1>
          <span>Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {visibleNavItems.map(({ key, path, icon: Icon }) => (
          // NavLink: highlights the active route using the EXISTING
          // "is-active" sidebar styling, and navigates without a full
          // browser page refresh.
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
          >
            <Icon />
            <span>{t[key]}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
