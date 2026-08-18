import React, { useContext } from 'react'
import {
  MdOutlineLocationOn,
  MdOutlineBadge,
  MdOutlinePerson,
  MdOutlineCurrencyRupee,
  MdOutlineEventAvailable
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'

// Project status is stored as a fixed English key, same pattern as
// CustomerCard, so it maps cleanly onto the existing status-pill styles.
const STATUS_CLASS = {
  Ongoing: 'status-active',
  Completed: 'status-completed',
  'On Hold': 'status-inactive',
  Delayed: 'status-inactive'
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export default function ProjectCard({ project, onViewProject }) {
  const { t } = useContext(ThemeContext)

  const STATUS_LABEL = {
    Ongoing: t.ongoing,
    Completed: t.completed,
    'On Hold': t.onHold,
    Delayed: t.delayed || 'Delayed'
  }

  const progressFillClass = project.status === 'Completed'
    ? 'is-complete'
    : project.status === 'Delayed'
      ? 'is-delayed'
      : ''

  return (
    // Reuses the exact same "customer-card" markup/classes as the
    // Customers page so this card matches the approved design exactly.
    <div className="customer-card">
      <div className="customer-photo">
        <img src={project.image} alt={project.projectType} loading="lazy" />
      </div>

      <div className="customer-card-body">
        <div className="customer-card-title-row">
          <div>
            <div className="customer-name">{project.name}</div>
            <div className="customer-id">{project.customerName}</div>
          </div>
          <span className={`status-pill ${STATUS_CLASS[project.status] || 'status-active'}`}>
            {STATUS_LABEL[project.status] || project.status}
          </span>
        </div>

        <div className="customer-project-type">{project.projectType}</div>

        <ul className="customer-meta-list">
          <li>
            <MdOutlinePerson /> {t.customerLabel}: {project.customerName}
          </li>
          <li>
            <MdOutlineBadge /> {t.designerLabel}: {project.designer}
          </li>
          <li>
            <MdOutlineLocationOn /> {project.location}
          </li>
          <li>
            <MdOutlineCurrencyRupee /> {t.budgetLabel}: {formatCurrency(project.budget)}
          </li>
          <li>
            <MdOutlineEventAvailable /> {t.timelineLabel}: {formatDate(project.startDate)} – {formatDate(project.endDate)}
          </li>
        </ul>

        <div className="project-progress-block">
          <div className="project-progress-row">
            <span>{t.overallProgressLabel}</span>
            <strong>{project.progress}%</strong>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill ${progressFillClass}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="current-stage-chip">{t.currentStageLabel}: {project.currentStage}</span>
        </div>

        <div className="customer-card-footer">
          <button type="button" className="btn-view-details" onClick={() => onViewProject(project)}>
            {t.viewProject}
          </button>
        </div>
      </div>
    </div>
  )
}
