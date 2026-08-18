import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdNotificationsNone, MdOutlineChatBubbleOutline, MdLogout } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageDropdown from './LanguageDropdown.jsx'

export default function Header() {
  const { t } = useContext(ThemeContext)
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  // useState: whether the small Logout menu under the admin profile is open.
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // useRef: holds the profile area's DOM node so a click outside of it can
  // close the menu (see the useEffect below).
  const profileRef = useRef(null)

  // useEffect: listens for clicks anywhere in the document while the menu
  // is open, and closes the menu if the click landed outside the profile area.
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // useCallback: stable logout handler — clears auth state, then navigates
  // to /login without a full page reload.
  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return (
    <header className="app-header">
      <div className="header-search">
        <MdSearch />
        <input type="text" placeholder={t.searchPlaceholder} />
      </div>

      <div className="header-actions">
        <ThemeToggle />
        <LanguageDropdown />
        <button className="icon-btn" aria-label={t.notifications} title={t.notifications}>
          <MdNotificationsNone />
        </button>
        <button className="icon-btn" aria-label={t.messages} title={t.messages}>
          <MdOutlineChatBubbleOutline />
        </button>
        <div className="admin-profile" ref={profileRef} onClick={() => setIsMenuOpen((prev) => !prev)}>
          <div className="admin-info">
            <div className="admin-name">{user?.name}</div>
            <div className="admin-role">{user?.roleLabel}</div>
          </div>
          <div className="admin-avatar">{user?.avatarInitial}</div>

          {isMenuOpen && (
            <div className="admin-menu" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="admin-menu-item" onClick={handleLogout}>
                <MdLogout /> {t.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
