import React, { useContext, useMemo } from 'react'
import {
  MdOutlineCurrencyRupee,
  MdOutlineFolderOpen,
  MdOutlineGroups,
  MdOutlineAccountBalanceWallet,
  MdOutlineFileDownload
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import {
  SAMPLE_PAYMENTS,
  SAMPLE_DESIGNERS,
  REVENUE_TREND,
  CUSTOMER_GROWTH,
  MATERIAL_USAGE
} from '../data/sampleData.js'

function formatLakh(amount) {
  return `₹${(amount / 100000).toFixed(1)}L`
}

export default function Reports() {
  // useContext: shared language strings + theme, and the SAME shared
  // customers/projects lists every other page reads from — so Reports
  // reflects any customer/project added elsewhere in the app.
  const { t } = useContext(ThemeContext)
  const { customers, projects } = useContext(DataContext)

  // useMemo: every metric on this page is derived from the shared sample
  // datasets, recomputed only if those source arrays ever change identity.
  const totalRevenue = useMemo(
    () => SAMPLE_PAYMENTS.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
    []
  )
  const totalPayments = useMemo(
    () => SAMPLE_PAYMENTS.reduce((sum, p) => sum + p.amount, 0),
    []
  )
  const projectStatusCounts = useMemo(() => {
    const ongoing = projects.filter((p) => p.status === 'Ongoing').length
    const completed = projects.filter((p) => p.status === 'Completed').length
    const delayed = projects.filter((p) => p.status === 'Delayed').length
    const onHold = projects.filter((p) => p.status === 'On Hold').length
    return { ongoing, completed, delayed, onHold, total: projects.length }
  }, [projects])

  const designerPerformance = useMemo(
    () =>
      [...SAMPLE_DESIGNERS]
        .map((d) => ({ ...d, completedCount: 10 + d.activeProjects * 2 }))
        .sort((a, b) => b.completedCount - a.completedCount),
    []
  )
  const maxDesignerCount = useMemo(
    () => Math.max(...designerPerformance.map((d) => d.completedCount)),
    [designerPerformance]
  )
  const maxRevenue = useMemo(() => Math.max(...REVENUE_TREND.map((m) => m.value)), [])
  const maxGrowth = useMemo(() => Math.max(...CUSTOMER_GROWTH.map((m) => m.value)), [])
  const maxMaterial = useMemo(() => Math.max(...MATERIAL_USAGE.map((m) => m.value)), [])

  const handleExport = () => {
    window.print()
  }

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.reportsPageTitle}</h2>
          <p>{t.reportsPageSubtitle}</p>
        </div>
        <button className="btn-primary" onClick={handleExport}>
          <MdOutlineFileDownload /> {t.exportReport}
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineCurrencyRupee />} value={formatLakh(totalRevenue)} label={t.revenueLabel || 'Revenue'} trend="+14.8%" />
        <SummaryCard icon={<MdOutlineFolderOpen />} value={projects.length} label={t.projectsLabel || 'Projects'} trend="+8.4%" />
        <SummaryCard icon={<MdOutlineGroups />} value={customers.length} label={t.totalCustomers} trend="+12.5%" />
        <SummaryCard icon={<MdOutlineAccountBalanceWallet />} value={formatLakh(totalPayments)} label={t.paymentsLabel || 'Payments'} trend="+10.2%" />
      </div>

      <div className="chart-grid-2">
        <div className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <h3>{t.revenueOverview}</h3>
              <p>{t.revenueTrendSubtitle}</p>
            </div>
          </div>
          <div className="bar-chart">
            {REVENUE_TREND.map((m) => (
              <div className="bar-chart-col" key={m.month}>
                <div className="bar-chart-bar" style={{ height: `${(m.value / maxRevenue) * 100}%` }} title={`₹${m.value}L`} />
                <span className="bar-chart-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-panel-header">
            <h3>{t.projectStatusDistribution}</h3>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label"><span className="legend-dot" /> {t.ongoing}</span>
            <span className="breakdown-row-value">{projectStatusCounts.ongoing}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label"><span className="legend-dot selected" /> {t.completed}</span>
            <span className="breakdown-row-value">{projectStatusCounts.completed}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label">{t.delayed}</span>
            <span className="breakdown-row-value">{projectStatusCounts.delayed}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-row-label">{t.onHold}</span>
            <span className="breakdown-row-value">{projectStatusCounts.onHold}</span>
          </div>
          <div className="breakdown-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
            <span className="breakdown-row-label">{t.totalProjects || 'Total Projects'}</span>
            <span className="breakdown-row-value">{projectStatusCounts.total}</span>
          </div>
        </div>
      </div>

      <div className="chart-grid-2">
        <div className="chart-panel">
          <div className="chart-panel-header">
            <h3>{t.materialUsage}</h3>
          </div>
          {MATERIAL_USAGE.map((m) => (
            <div className="horizontal-bar-row" key={m.label}>
              <span className="horizontal-bar-label">{m.label}</span>
              <div className="horizontal-bar-track">
                <div className="horizontal-bar-fill" style={{ width: `${(m.value / maxMaterial) * 100}%` }} />
              </div>
              <span className="horizontal-bar-value">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <h3>{t.customerGrowth}</h3>
              <p>{t.lastSixMonths || 'Last six months'}</p>
            </div>
          </div>
          <div className="bar-chart">
            {CUSTOMER_GROWTH.map((m) => (
              <div className="bar-chart-col" key={m.month}>
                <div className="bar-chart-bar" style={{ height: `${(m.value / maxGrowth) * 100}%` }} title={`${m.value}`} />
                <span className="bar-chart-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-panel">
        <div className="chart-panel-header">
          <h3>{t.designerPerformance}</h3>
        </div>
        {designerPerformance.map((d) => (
          <div className="horizontal-bar-row" key={d.id}>
            <span className="horizontal-bar-label">{d.name}</span>
            <div className="horizontal-bar-track">
              <div className="horizontal-bar-fill gold" style={{ width: `${(d.completedCount / maxDesignerCount) * 100}%` }} />
            </div>
            <span className="horizontal-bar-value">{d.completedCount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
