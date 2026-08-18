import React, { useContext } from 'react'
import { ThemeContext, languageLabels } from '../context/ThemeContext.jsx'

export default function LanguageDropdown() {
  const { language, changeLanguage, t } = useContext(ThemeContext)

  return (
    <div className="language-dropdown">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label={t.selectLanguage}
      >
        {Object.entries(languageLabels).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
