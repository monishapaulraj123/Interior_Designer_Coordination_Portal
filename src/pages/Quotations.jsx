import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  MdOutlineDescription,
  MdOutlineCheckCircle,
  MdOutlineSchedule,
  MdOutlineCancel,
  MdAdd,
  MdClose,
  MdOutlineDownload
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { SAMPLE_QUOTATIONS } from '../data/sampleData.js'

const STATUS_CLASS = {
  Approved: 'status-active',
  Pending: 'status-inactive',
  Rejected: 'status-inactive'
}

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

const EMPTY_FORM = { projectId: '', amount: '', validUntil: '' }

export default function Quotations() {
  // useContext: shared language strings, theme, and the logged-in user
  // (customers only ever see quotations tied to their own project).
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { projects } = useContext(DataContext)

  const [quotations, setQuotations] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  // useEffect: loads quotations from local sample data once, on mount.
  useEffect(() => {
    setQuotations(SAMPLE_QUOTATIONS)
  }, [])

  // useMemo: role-scoped quotations — a customer only ever sees their own.
  const roleScopedQuotations = useMemo(() => {
    if (user?.role === 'customer') {
      const myProject = projects.find((p) => p.customerId === user.customerId)
      return quotations.filter((q) => q.projectId === myProject?.id)
    }
    return quotations
  }, [quotations, user, projects])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // useCallback: resets/closes the Create Quotation modal.
  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setIsModalOpen(false)
  }, [])

  // useCallback: creates a new quotation tied to a chosen project, stored
  // only in local React state (frontend-only sample data).
  const handleCreateQuotation = useCallback(
    (e) => {
      e.preventDefault()
      const project = projects.find((p) => String(p.id) === String(form.projectId))
      if (!project || !form.amount) return
      const newQuotation = {
        id: Date.now(),
        quotationId: `QT-2026-${String(quotations.length + 1).padStart(3, '0')}`,
        projectId: project.id,
        customerName: project.customerName,
        projectName: project.name,
        projectType: project.projectType,
        amount: Number(form.amount),
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
        validUntil: form.validUntil || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)
      }
      setQuotations((prev) => [newQuotation, ...prev])
      handleResetForm()
    },
    [form, quotations.length, handleResetForm, projects]
  )

  // useMemo: filtered list, only recomputed when its real inputs change.
  const filteredQuotations = useMemo(
    () =>
      roleScopedQuotations.filter((q) => {
        if (activeFilter === 'all') return true
        return q.status.toLowerCase() === activeFilter
      }),
    [roleScopedQuotations, activeFilter]
  )

  const stats = useMemo(
    () => ({
      total: roleScopedQuotations.length,
      approved: roleScopedQuotations.filter((q) => q.status === 'Approved').length,
      pending: roleScopedQuotations.filter((q) => q.status === 'Pending').length,
      rejected: roleScopedQuotations.filter((q) => q.status === 'Rejected').length
    }),
    [roleScopedQuotations]
  )

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.pageTitleQuotations || 'Quotation Management'}</h2>
          <p>{t.quotationsPageSubtitle}</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'designer') && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <MdAdd /> {t.createQuotation}
          </button>
        )}
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineDescription />} value={stats.total} label={t.totalQuotations} trend="+12%" />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.approved} label={t.approved} trend="+8%" />
        <SummaryCard icon={<MdOutlineSchedule />} value={stats.pending} label={t.pending} />
        <SummaryCard icon={<MdOutlineCancel />} value={stats.rejected} label={t.rejected} />
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.allQuotations || 'All Quotations'}</h3>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allQuotations || 'All Quotations' },
            { key: 'approved', label: t.approved },
            { key: 'pending', label: t.pending },
            { key: 'rejected', label: t.rejected }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`filter-tab${activeFilter === tab.key ? ' is-active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredQuotations.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div className="customer-grid">
            {filteredQuotations.map((q) => (
              <div className="customer-card" key={q.id}>
                <div className="customer-card-body" style={{ paddingTop: 20 }}>
                  <div className="customer-card-title-row">
                    <div>
                      <div className="customer-name">{q.quotationId}</div>
                      <div className="customer-id">{q.projectName}</div>
                    </div>
                    <span className={`status-pill ${STATUS_CLASS[q.status] || 'status-active'}`}>
                      {t[q.status] || q.status}
                    </span>
                  </div>

                  <div className="project-detail-meta-grid" style={{ margin: '16px 0' }}>
                    <div>
                      <dt style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>{t.customerLabel}</dt>
                      <dd style={{ fontWeight: 600 }}>{q.customerName}</dd>
                    </div>
                    <div>
                      <dt style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>{t.quotationDateLabel}</dt>
                      <dd style={{ fontWeight: 600 }}>{formatDate(q.date)}</dd>
                    </div>
                    <div>
                      <dt style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>{t.validUntilLabel}</dt>
                      <dd style={{ fontWeight: 600 }}>{formatDate(q.validUntil)}</dd>
                    </div>
                    <div>
                      <dt style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>{t.estimatedCostLabel}</dt>
                      <dd style={{ fontWeight: 700, color: 'var(--forest-green)' }}>{formatCurrency(q.amount)}</dd>
                    </div>
                  </div>

                  <div className="customer-card-footer">
                    <button type="button" className="btn-small-outline">
                      <MdOutlineDownload /> {t.downloadPdf}
                    </button>
                    <a className="btn-view-details" href="#">{t.viewDetails}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleResetForm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.createQuotation}</h3>
              <button className="modal-close" onClick={handleResetForm} aria-label={t.closeModal}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleCreateQuotation}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Project</label>
                  <select name="projectId" value={form.projectId} onChange={handleFormChange} required>
                    <option value="">—</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.customerName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>{t.estimatedCostLabel}</label>
                  <input type="number" name="amount" min="0" value={form.amount} onChange={handleFormChange} required />
                </div>
                <div className="form-field">
                  <label>{t.validUntilLabel}</label>
                  <input type="date" name="validUntil" value={form.validUntil} onChange={handleFormChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleResetForm}>{t.cancel}</button>
                <button type="submit" className="btn-primary">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
