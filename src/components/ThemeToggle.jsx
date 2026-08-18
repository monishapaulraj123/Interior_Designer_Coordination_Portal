import React, { useContext } from 'react'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme, t } = useContext(ThemeContext)

  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? t.toggleToDark : t.toggleToLight}
      title={theme === 'light' ? t.toggleToDark : t.toggleToLight}
    >
      {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
    </button>
  )
}
