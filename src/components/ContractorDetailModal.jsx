import React, { useContext, useMemo } from 'react'
import { MdClose, MdOutlinePhone, MdOutlineEmail, MdStar } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { DataContext } from '../context/DataContext.jsx'

const STATUS_CLASS = { Ongoing: 'status-active', Completed: 'status-completed', 'On Hold': 'status-inactive', Delayed: 'status-inactive' }

// Shows a contractor's own information PLUS every project currently
// assigned to them — each with its live current stage and progress, read
// straight from the shared DataContext.projects list.
export default function ContractorDetailModal({ contractor, onClose, onViewProject }) {
  const { t } = useContext(ThemeContext)
  const { projects } = useContext(DataContext)

  // useMemo: this contractor's assigned projects, matched by name — the
  // same relationship key used across Customers/Projects/Dashboard.
  const assignedProjects = useMemo(
    () => projects.filter((p) => p.contractor === contractor.name),
    [projects, contractor.name]
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{contractor.name}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t.closeModal}>
            <MdClose />
          </button>
        </div>

        <div className="project-detail-header">
          <div className="project-detail-photo">
            <img src={contractor.photo} alt={contractor.name} />
          </div>
          <div>
            <div className="customer-project-type">{t.contactPersonLabel}: {contractor.contactPerson}</div>
            <ul className="customer-meta-list" style={{ marginTop: 8 }}>
              <li><MdStar /> {contractor.rating} / 5.0</li>
              <li><MdOutlinePhone /> {contractor.phone}</li>
              <li><MdOutlineEmail /> {contractor.email}</li>
            </ul>
          </div>
        </div>

        <dl className="project-detail-meta-grid">
          <div>
            <dt>{t.employeeIdLabel}</dt>
            <dd>{contractor.contractorId}</dd>
          </div>
          <div>
            <dt>{t.experienceLabel}</dt>
            <dd>{contractor.experience}</dd>
          </div>
          <div>
            <dt>{t.statusLabel}</dt>
            <dd>{t[contractor.status] || contractor.status}</dd>
          </div>
          <div>
            <dt>{t.activeProjectsLabel || 'Assigned Projects'}</dt>
            <dd>{assignedProjects.length}</dd>
          </div>
        </dl>

        <h4 style={{ fontSize: '0.9375rem', marginBottom: 10 }}>{t.assignedProjectsLabel || 'Assigned Projects'}</h4>

        {assignedProjects.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {assignedProjects.map((project) => (
              <div key={project.id} className="chart-panel" style={{ padding: '16px 18px' }}>
                <div className="project-progress-row" style={{ marginBottom: 8 }}>
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>{project.name}</strong>
                    {' · '}{project.customerName}
                  </span>
                  <span className={`status-pill ${STATUS_CLASS[project.status] || 'status-active'}`}>
                    {t[project.status] || project.status}
                  </span>
                </div>
                <div className="project-progress-row">
                  <span>{t.currentStageLabel}: <strong>{project.currentStage}</strong></span>
                  <strong>{project.progress}%</strong>
                </div>
                <div className="progress-bar-track" style={{ marginBottom: 10 }}>
                  <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
                </div>
                <button type="button" className="btn-small-outline" onClick={() => onViewProject(project)}>
                  {t.viewProject}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


