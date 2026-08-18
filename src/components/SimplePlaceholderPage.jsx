import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext.jsx'

// A small, reusable page used for sidebar items that don't have a full
// module yet (e.g. Suppliers, Appointments, Payments, Reports). It reuses
// the exact same page-content / page-header-row / directory-panel /
// empty-state classes as every other page, so it matches the finalized
// UI without introducing any new styles.
export default function SimplePlaceholderPage({ titleKey, icon }) {
  const { t } = useContext(ThemeContext)

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t[titleKey]}</h2>
        </div>
      </div>

      <div className="directory-panel">
        <div className="empty-state">
          <div style={{ fontSize: '2rem', marginBottom: 10 }}>{icon}</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.comingSoonTitle}</div>
          <div>{t.comingSoonDesc}</div>
        </div>
      </div>
    </div>
  )
}
