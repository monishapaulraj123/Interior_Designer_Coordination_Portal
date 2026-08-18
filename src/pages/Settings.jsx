import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdCheck } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import LanguageDropdown from '../components/LanguageDropdown.jsx'

const FONT_SIZE_OPTIONS = ['small', 'medium', 'large']

export default function Settings() {
  // useContext: Settings reads AND writes the same global theme, language,
  // and font-size state used across the whole app — no separate systems.
  const { theme, changeTheme, language, changeFontSize, fontSize, t } = useContext(ThemeContext)

  // useState: local UI-only state for the small "Preferences updated" hint
  // that appears briefly after the user changes a setting.
  const [savedMessage, setSavedMessage] = useState(false)

  // useRef: holds the pending setTimeout id so we can clear a previous
  // timer before starting a new one (avoids the hint flickering when the
  // user changes several settings quickly).
  const hideTimerRef = useRef(null)

  // useEffect: whenever theme, fontSize, or language change, briefly show
  // the "Preferences updated" confirmation, then hide it again.
  useEffect(() => {
    setSavedMessage(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setSavedMessage(false), 1800)
    return () => clearTimeout(hideTimerRef.current)
  }, [theme, fontSize, language])

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.settingsPageTitle}</h2>
          <p>{t.settingsPageSubtitle}</p>
        </div>
        {savedMessage && (
          <span className="status-pill status-active settings-saved-pill">
            <MdCheck /> {t.save}
          </span>
        )}
      </div>

      <div className="settings-grid">
        {/* A. Appearance — quick summary of the currently selected options */}
        <section className="directory-panel settings-section">
          <h3>{t.appearanceSection}</h3>
          <p className="settings-section-desc">{t.appearanceDesc}</p>
          <div className="settings-summary-chips">
            <span className="status-pill status-completed">{theme === 'dark' ? t.darkTheme : t.lightTheme}</span>
            <span className="status-pill status-completed">{t[fontSize]}</span>
          </div>
        </section>

        {/* B. Font Size */}
        <section className="directory-panel settings-section">
          <h3>{t.fontSizeSection}</h3>
          <p className="settings-section-desc">{t.fontSizeDesc}</p>
          <div className="filter-tabs">
            {FONT_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                className={`filter-tab${fontSize === size ? ' is-active' : ''}`}
                onClick={() => changeFontSize(size)}
              >
                {t[size]}
              </button>
            ))}
          </div>
        </section>

        {/* C. Language */}
        <section className="directory-panel settings-section">
          <h3>{t.languageSection}</h3>
          <p className="settings-section-desc">{t.languageDesc}</p>
          <LanguageDropdown />
        </section>

        {/* D. Theme / Background */}
        <section className="directory-panel settings-section">
          <h3>{t.themeSection}</h3>
          <p className="settings-section-desc">{t.themeDesc}</p>
          <div className="filter-tabs">
            <button
              className={`filter-tab${theme === 'light' ? ' is-active' : ''}`}
              onClick={() => changeTheme('light')}
            >
              {t.lightTheme}
            </button>
            <button
              className={`filter-tab${theme === 'dark' ? ' is-active' : ''}`}
              onClick={() => changeTheme('dark')}
            >
              {t.darkTheme}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
