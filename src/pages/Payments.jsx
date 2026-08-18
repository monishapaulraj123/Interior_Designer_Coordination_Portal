import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  MdOutlineCurrencyRupee,
  MdOutlineHourglassEmpty,
  MdOutlineCheckCircle,
  MdOutlineErrorOutline,
  MdAdd,
  MdClose
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { SAMPLE_PAYMENTS, REVENUE_TREND } from '../data/sampleData.js'

const STATUS_CLASS = {
  Paid: 'status-active',
  Pending: 'status-inactive',
  Overdue: 'status-inactive'
}

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}
function formatLakh(amount) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

const EMPTY_FORM = { projectId: '', amount: '', method: 'Bank Transfer', dueDate: '' }

export default function Payments() {
  // useContext: shared language strings, theme, and the logged-in user
  // (customers only ever see their own invoices/payments).
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { projects } = useContext(DataContext)

  const [payments, setPayments] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  // useEffect: loads payment/invoice records from local sample data once.
  useEffect(() => {
    setPayments(SAMPLE_PAYMENTS)
  }, [])

  // useMemo: role-scoped payments — a customer sees only invoices for
  // their own project.
  const roleScopedPayments = useMemo(() => {
    if (user?.role === 'customer') {
      const myProject = projects.find((p) => p.customerId === user.customerId)
      return payments.filter((p) => p.projectId === myProject?.id)
    }
    return payments
  }, [payments, user, projects])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }
  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setIsModalOpen(false)
  }, [])

  // useCallback: records a new payment/invoice into local React state only.
  const handleRecordPayment = useCallback(
    (e) => {
      e.preventDefault()
      const project = projects.find((p) => String(p.id) === String(form.projectId))
      if (!project || !form.amount) return
      const newPayment = {
        id: Date.now(),
        invoiceId: `INV-2026-${String(payments.length + 1).padStart(3, '0')}`,
        projectId: project.id,
        customerName: project.customerName,
        projectName: project.name,
        amount: Number(form.amount),
        method: form.method,
        paymentDate: new Date().toISOString().slice(0, 10),
        dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
        status: 'Paid'
      }
      setPayments((prev) => [newPayment, ...prev])
      handleResetForm()
    },
    [form, payments.length, handleResetForm, projects]
  )

  // useMemo: filtered transactions list.
  const filteredPayments = useMemo(
    () =>
      roleScopedPayments.filter((p) => {
        if (activeFilter === 'all') return true
        return p.status.toLowerCase() === activeFilter
      }),
    [roleScopedPayments, activeFilter]
  )

  // useMemo: revenue stats derived from the role-scoped payment list.
  const stats = useMemo(() => {
    const paid = roleScopedPayments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
    const pending = roleScopedPayments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)
    const overdue = roleScopedPayments.filter((p) => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0)
    return { paid, pending, overdue, total: paid + pending + overdue }
  }, [roleScopedPayments])

  const maxRevenue = useMemo(() => Math.max(...REVENUE_TREND.map((m) => m.value)), [])

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.paymentsPageTitle}</h2>
          <p>{t.paymentsPageSubtitle}</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <MdAdd /> {t.recordPayment}
          </button>
        )}
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineCurrencyRupee />} value={formatLakh(stats.total)} label={t.totalRevenue} trend="+14.8%" />
        <SummaryCard icon={<MdOutlineHourglassEmpty />} value={formatLakh(stats.pending)} label={t.pendingPayments} />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={formatLakh(stats.paid)} label={t.paidLabel} trend="+11.2%" />
        <SummaryCard icon={<MdOutlineErrorOutline />} value={formatLakh(stats.overdue)} label={t.overdueLabel} />
      </div>

      <div className="chart-grid-2">
        <div className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <h3>{t.revenueTrend}</h3>
              <p>{t.revenueTrendSubtitle}</p>
            </div>
          </div>
          <div className="bar-chart">
            {REVENUE_TREND.map((m, idx) => (
              <div className="bar-chart-col" key={m.month}>
                <div
                  className={`bar-chart-bar${idx >= REVENUE_TREND.length - 2 ? ' is-highlight' : ''}`}
                  style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                  title={`₹${m.value}L`}
                />
                <span className="bar-chart-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-panel-header">
            <h3>{t.paymentBreakdown}</h3>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label"><span className="legend-dot" /> {t.paidLabel}</span>
            <span className="breakdown-row-value">{formatLakh(stats.paid)}</span>
          </div>
          <div className="horizontal-bar-track" style={{ marginBottom: 14 }}>
            <div className="horizontal-bar-fill" style={{ width: `${stats.total ? (stats.paid / stats.total) * 100 : 0}%` }} />
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label"><span className="legend-dot selected" /> {t.pending}</span>
            <span className="breakdown-row-value">{formatLakh(stats.pending)}</span>
          </div>
          <div className="horizontal-bar-track" style={{ marginBottom: 14 }}>
            <div className="horizontal-bar-fill gold" style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }} />
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label">{t.overdueLabel}</span>
            <span className="breakdown-row-value">{formatLakh(stats.overdue)}</span>
          </div>
          <div className="breakdown-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 4 }}>
            <span className="breakdown-row-label">{t.totalInvoiced}</span>
            <span className="breakdown-row-value">{formatLakh(stats.total)}</span>
          </div>
        </div>
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.paymentTransactions}</h3>
        </div>
        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allPayments || 'All Payments' },
            { key: 'paid', label: t.paidLabel },
            { key: 'pending', label: t.pending },
            { key: 'overdue', label: t.overdueLabel }
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

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.invoiceLabel}</th>
                <th>{t.customerLabel} / {t.projectLabel || 'Project'}</th>
                <th>{t.amountLabel}</th>
                <th>{t.methodLabel}</th>
                <th>{t.paymentDateLabel}</th>
                <th>{t.statusLabel}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t.emptyState}</td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.invoiceId}</td>
                    <td>
                      {p.customerName}
                      <div className="table-cell-subtitle">{p.projectName}</div>
                    </td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td>{p.method}</td>
                    <td>
                      {formatDate(p.paymentDate)}
                      <div className="table-cell-subtitle">Due {formatDate(p.dueDate)}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${STATUS_CLASS[p.status] || 'status-active'}`}>{t[p.status] || p.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleResetForm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.recordPayment}</h3>
              <button className="modal-close" onClick={handleResetForm} aria-label={t.closeModal}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleRecordPayment}>
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
                  <label>{t.amountLabel}</label>
                  <input type="number" name="amount" min="0" value={form.amount} onChange={handleFormChange} required />
                </div>
                <div className="form-field">
                  <label>{t.methodLabel}</label>
                  <select name="method" value={form.method} onChange={handleFormChange}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Due Date</label>
                  <input type="date" name="dueDate" value={form.dueDate} onChange={handleFormChange} />
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
