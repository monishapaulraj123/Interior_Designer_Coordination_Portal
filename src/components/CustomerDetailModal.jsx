import React, { useContext, useMemo } from 'react'
import { MdClose, MdOutlinePhone, MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import StageTimeline from './StageTimeline.jsx'

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

// Shows a customer's own information PLUS their linked project, designer,
// contractor, current/next stage and full stage timeline — all read from
// the same shared DataContext.projects list that Designer/Contractor/
// Project detail views also read from, so this is always in sync with them.
export default function CustomerDetailModal({ customer, onClose }) {
  const { t } = useContext(ThemeContext)
  const { projects } = useContext(DataContext)

  // useMemo: this customer's linked project — looked up by customerId,
  // the same relationship key used everywhere else in the app.
  const project = useMemo(
    () => projects.find((p) => p.customerId === customer.id),
    [projects, customer.id]
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{customer.name}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t.closeModal}>
            <MdClose />
          </button>
        </div>

        <div className="project-detail-header">
          <div className="project-detail-photo">
            <img src={customer.photo} alt={customer.projectType} />
          </div>
          <div>
            <div className="customer-project-type">{customer.projectType}</div>
            <ul className="customer-meta-list" style={{ marginTop: 8 }}>
              <li><MdOutlineLocationOn /> {customer.address ? `${customer.address}, ` : ''}{customer.location}</li>
              <li><MdOutlinePhone /> {customer.phone}</li>
              <li><MdOutlineEmail /> {customer.email}</li>
            </ul>
          </div>
        </div>

        <dl className="project-detail-meta-grid">
          <div>
            <dt>{t.customerIdLabel || 'Customer ID'}</dt>
            <dd>{customer.customerId}</dd>
          </div>
          <div>
            <dt>{t.statusLabel}</dt>
            <dd>{t[customer.status] || customer.status}</dd>
          </div>
          <div>
            <dt>{t.propertyTypeLabel}</dt>
            <dd>{customer.propertyType || '—'}</dd>
          </div>
          <div>
            <dt>{t.budgetLabel}</dt>
            <dd>{formatCurrency(customer.budget)}</dd>
          </div>
          <div>
            <dt>{t.designerLabel}</dt>
            <dd>{customer.designer || '—'}</dd>
          </div>
          <div>
            <dt>{t.contractorLabel}</dt>
            <dd>{customer.contractor || '—'}</dd>
          </div>
        </dl>

        {customer.requirements && (
          <div style={{ marginBottom: 18 }}>
            <div className="table-cell-subtitle" style={{ marginBottom: 4 }}>{t.requirementsLabel}</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{customer.requirements}</p>
          </div>
        )}

        {project ? (
          <>
            <div className="workflow-chip-row">
              <span className="workflow-chip">
                <strong>{t.projectLabel || 'Project'}:</strong> {project.name}
              </span>
              <span className="workflow-chip">
                <strong>{t.currentStageLabel}:</strong> {project.currentStage}
              </span>
              <span className="workflow-chip">
                <strong>{t.nextStageLabel}:</strong> {project.nextStage || t.projectCompleted}
              </span>
            </div>

            <div className="project-progress-block" style={{ marginBottom: 18 }}>
              <div className="project-progress-row">
                <span>{t.overallProgressLabel}</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <h4 style={{ fontSize: '0.9375rem', marginBottom: 4 }}>{t.stageTimelineLabel}</h4>
            <StageTimeline currentStageIndex={project.currentStageIndex} />
          </>
        ) : (
          <div className="empty-state">{t.noProjectLinked || 'No project linked to this customer yet.'}</div>
        )}
      </div>
    </div>
  )
}
