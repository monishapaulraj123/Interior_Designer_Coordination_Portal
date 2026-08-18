import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdErrorOutline } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'

export default function NotFound() {
  const { t } = useContext(ThemeContext)
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="directory-panel">
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
            <MdErrorOutline />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 6 }}>
            {t.notFoundTitle}
          </div>
          <p style={{ marginBottom: 18 }}>{t.notFoundDesc}</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            {t.backToDashboard}
          </button>
        </div>
      </div>
    </div>
  )
}
