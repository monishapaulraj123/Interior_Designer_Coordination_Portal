import React from 'react'

export default function SummaryCard({ icon, value, label, trend }) {
  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <div className="summary-icon">{icon}</div>
        {trend && <span className="summary-trend">{trend}</span>}
      </div>
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  )
}
