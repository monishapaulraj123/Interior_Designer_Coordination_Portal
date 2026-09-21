import React, { useContext, useMemo } from 'react'
import { MdClose } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { PROJECT_STAGES, SAMPLE_QUOTATIONS, SAMPLE_PAYMENTS } from '../data/sampleData.js'
import StageTimeline from './StageTimeline.jsx'

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

export default function ProjectDetailModal({ project, onClose, onAdvanceStage }) {
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)

  // useMemo: this project's linked quotation + payment, looked up from
  // sample data so the modal reflects the Customer -> Project -> ... ->
  // Quotation -> Payment workflow the brief asks for, without re-deriving
  // it on every render.
  const linkedQuotation = useMemo(
    () => SAMPLE_QUOTATIONS.find((q) => q.projectId === project.id),
    [project.id]
  )
  const linkedPayment = useMemo(
    () => SAMPLE_PAYMENTS.find((p) => p.projectId === project.id),
    [project.id]
  )

  const canAdvance =
    (user?.role === 'admin' || user?.role === 'designer') && project.currentStageIndex < PROJECT_STAGES.length - 1

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project.name}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t.closeModal}>
            <MdClose />
          </button>
        </div>

        <div className="project-detail-header">
          <div className="project-detail-photo">
            <img src={project.image} alt={project.projectType} />
          </div>
          <div>
            <div className="customer-project-type">{project.projectType}</div>
            <div className="project-progress-block" style={{ marginTop: 10, minWidth: 260 }}>
              <div className="project-progress-row">
                <span>{t.overallProgressLabel}</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <dl className="project-detail-meta-grid">
          <div>
            <dt>{t.customerLabel}</dt>
            <dd>{project.customerName}</dd>
          </div>
          <div>
            <dt>{t.designerLabel}</dt>
            <dd>{project.designer}</dd>
          </div>
          <div>
            <dt>{t.contractorLabel}</dt>
            <dd>{project.contractor}</dd>
          </div>
          <div>
            <dt>{t.budgetLabel}</dt>
            <dd>{formatCurrency(project.budget)}</dd>
          </div>
          <div>
            <dt>{t.startDateLabel}</dt>
            <dd>{formatDate(project.startDate)}</dd>
          </div>
          <div>
            <dt>{t.endDateLabel}</dt>
            <dd>{formatDate(project.endDate)}</dd>
          </div>
          <div>
            <dt>{t.currentStageLabel}</dt>
            <dd>{project.currentStage}</dd>
          </div>
          <div>
            <dt>{t.nextStageLabel}</dt>
            <dd>{project.nextStage || t.projectCompleted}</dd>
          </div>
        </dl>

        <div className="workflow-chip-row">
          <span className="workflow-chip">
            <strong>{t.quotationLabel}:</strong>{' '}
            {linkedQuotation ? `${linkedQuotation.quotationId} · ${linkedQuotation.status}` : '—'}
          </span>
          <span className="workflow-chip">
            <strong>{t.paymentLabel}:</strong>{' '}
            {linkedPayment ? `${linkedPayment.invoiceId} · ${linkedPayment.status}` : '—'}
          </span>
        </div>

        <h4 style={{ fontSize: '0.9375rem', marginBottom: 4 }}>{t.stageTimelineLabel}</h4>
        <StageTimeline currentStageIndex={project.currentStageIndex} />

        {canAdvance && (
          <div className="customer-card-footer" style={{ marginTop: 18 }}>
            <button type="button" className="btn-primary" onClick={() => onAdvanceStage(project.id)}>
              {t.advanceStage} → {project.nextStage}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



