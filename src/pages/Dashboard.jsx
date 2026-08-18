import React, { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdOutlineGroups,
  MdOutlineWork,
  MdOutlineFactCheck,
  MdOutlineRequestQuote,
  MdOutlineCalendarMonth,
  MdOutlineDashboard
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { luxuryLivingRoom } from '../assets/images/index.js'

export default function Dashboard() {
  // useContext: shared language strings + theme, same as every other page.
  const { t } = useContext(ThemeContext)

  // useContext: the logged-in user, so the greeting shows the right name
  // and every stat/list below is scoped to what this role should see.
  const { user } = useContext(AuthContext)

  // useContext: the SAME shared customers/projects lists every other page
  // (Customers, Designers, Contractors, Projects) reads from — so a new
  // customer or an advanced project stage shows up here immediately too.
  const { customers: allCustomers, projects: allProjects } = useContext(DataContext)

  // useNavigate: React Router's hook for programmatic navigation, used by
  // the "View All" links and hero buttons below instead of a full page reload.
  const navigate = useNavigate()

  // useMemo: role-scoped project list — this drives both the stat cards
  // and the "Recent Projects" panel below, so every role only ever sees
  // work that's actually theirs.
  const roleScopedProjects = useMemo(() => {
    if (!user || user.role === 'admin') return allProjects
    if (user.role === 'designer') return allProjects.filter((p) => p.designer === user.designerName)
    if (user.role === 'contractor') return allProjects.filter((p) => p.contractor === user.contractorName)
    if (user.role === 'customer') return allProjects.filter((p) => p.customerId === user.customerId)
    return allProjects
  }, [allProjects, user])

  const myProject = useMemo(
    () => (user?.role === 'customer' ? roleScopedProjects[0] : null),
    [roleScopedProjects, user]
  )

  // useMemo: the summary counts are only recalculated when the role-scoped
  // project/customer lists actually change.
  const stats = useMemo(() => {
    const relevantCustomerNames = new Set(roleScopedProjects.map((p) => p.customerName))
    const totalCustomers =
      user?.role === 'admin' ? allCustomers.length : relevantCustomerNames.size
    const activeProjects = roleScopedProjects.filter((p) => p.status === 'Ongoing').length
    const completedProjects = roleScopedProjects.filter((p) => p.status === 'Completed').length
    const pendingQuotations =
      user?.role === 'admin'
        ? allCustomers.filter((c) => c.status === 'Inactive').length
        : roleScopedProjects.filter((p) => p.status === 'On Hold' || p.status === 'Delayed').length
    return { totalCustomers, activeProjects, completedProjects, pendingQuotations }
  }, [roleScopedProjects, allCustomers, user])

  const recentProjects = roleScopedProjects.slice(0, 4)
  const recentCustomers = allCustomers
    .filter((c) => roleScopedProjects.some((p) => p.customerName === c.name))
    .slice(0, 5)

  return (
    <div className="page-content">
      <div className="dashboard-welcome" style={{ backgroundImage: `url(${luxuryLivingRoom})` }}>
        <div className="dashboard-welcome-content">
          <h2>
            {t.welcomeBackPrefix}, {user?.name}!
          </h2>
          <p>{t.dashboardSubtitle}</p>
          <div className="dashboard-welcome-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/appointments')}>
              <MdOutlineCalendarMonth /> {t.viewScheduleLabel || 'View Schedule'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/projects')}>
              <MdOutlineDashboard /> {t.projectOverviewLabel || 'Project Overview'}
            </button>
          </div>
        </div>
      </div>

      <div className="page-header-row">
        <div>
          <h2>{t.dashboard}</h2>
        </div>
      </div>

      {myProject && (
        <div className="my-project-banner">
          <img src={myProject.image} alt={myProject.projectType} />
          <div className="my-project-banner-body">
            <h4>{myProject.name}</h4>
            <div className="project-progress-row">
              <span>{t.currentStageLabel}: <strong>{myProject.currentStage}</strong></span>
              <strong>{myProject.progress}%</strong>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${myProject.progress}%` }} />
            </div>
          </div>
          <a href="#" className="btn-view-details" onClick={(e) => { e.preventDefault(); navigate('/projects') }}>
            {t.viewProject}
          </a>
        </div>
      )}

      <div className="summary-grid">
        <SummaryCard
          icon={<MdOutlineGroups />}
          value={stats.totalCustomers}
          label={t.totalCustomers}
          trend="+12%"
        />
        <SummaryCard
          icon={<MdOutlineWork />}
          value={stats.activeProjects}
          label={t.activeProjects}
          trend="+6%"
        />
        <SummaryCard
          icon={<MdOutlineFactCheck />}
          value={stats.completedProjects}
          label={t.completedProjects}
          trend="+9%"
        />
        <SummaryCard
          icon={<MdOutlineRequestQuote />}
          value={stats.pendingQuotations}
          label={t.pendingQuotations}
          trend="+2%"
        />
      </div>

      <div className="recent-grid">
        <section className="recent-panel">
          <div className="recent-panel-header">
            <h3>{t.recentProjects}</h3>
            <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); navigate('/projects') }}>
              {t.viewAll}
            </a>
          </div>
          <div className="recent-list">
            {recentProjects.map((project) => (
              <div className="recent-item" key={project.id}>
                <div className="recent-item-photo">
                  <img src={project.image} alt={project.projectType} loading="lazy" />
                </div>
                <div className="recent-item-body">
                  <div className="recent-item-title">{project.name}</div>
                  <div className="recent-item-subtitle">
                    {project.customerName} &middot; {project.location}
                  </div>
                </div>
                <span className={`status-pill ${project.status === 'Ongoing' ? 'status-active' : project.status === 'Completed' ? 'status-completed' : 'status-inactive'}`}>
                  {project.status === 'Ongoing' ? t.ongoing : project.status === 'Completed' ? t.completed : project.status === 'Delayed' ? t.delayed : t.onHold}
                </span>
              </div>
            ))}
          </div>
        </section>

        {user?.role !== 'customer' && (
          <section className="recent-panel">
            <div className="recent-panel-header">
              <h3>{t.recentCustomers}</h3>
              {user?.role === 'admin' && (
                <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); navigate('/customers') }}>
                  {t.viewAll}
                </a>
              )}
            </div>
            <div className="recent-list">
              {recentCustomers.map((customer) => (
                <div className="recent-item" key={customer.id}>
                  <div className="recent-item-photo">
                    <img src={customer.photo} alt={customer.projectType} loading="lazy" />
                  </div>
                  <div className="recent-item-body">
                    <div className="recent-item-title">{customer.name}</div>
                    <div className="recent-item-subtitle">
                      {customer.projectType} &middot; {customer.location}
                    </div>
                  </div>
                  <span className={`status-pill ${customer.status === 'Active' ? 'status-active' : customer.status === 'Completed' ? 'status-completed' : 'status-inactive'}`}>
                    {customer.status === 'Active' ? t.active : customer.status === 'Completed' ? t.completed : t.inactive}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
