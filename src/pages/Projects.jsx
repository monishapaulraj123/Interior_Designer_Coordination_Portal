import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import {
  MdOutlineFolderOpen,
  MdOutlineAutorenew,
  MdOutlineCheckCircle,
  MdOutlineErrorOutline
} from 'react-icons/md'

export default function Projects() {
  // useContext: shared language strings, theme, the logged-in user (used
  // to scope which projects this role is even allowed to see), and the
  // shared projects list + stage-advance action from DataContext — this
  // is the SAME data every other page (Dashboard, Customers, Designers,
  // Contractors) reads from, so a stage update here is visible everywhere.
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { projects, advanceProjectStage } = useContext(DataContext)

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const searchInputRef = useRef(null)

  // useMemo: role-scoped project list — this is what makes "Designer sees
  // relevant projects", "Contractor sees assigned projects" and "Customer
  // sees only their own project" actually true, instead of just hiding
  // the nav link. Admin sees everything.
  const roleScopedProjects = useMemo(() => {
    if (!user || user.role === 'admin') return projects
    if (user.role === 'designer') return projects.filter((p) => p.designer === user.designerName)
    if (user.role === 'contractor') return projects.filter((p) => p.contractor === user.contractorName)
    if (user.role === 'customer') return projects.filter((p) => p.customerId === user.customerId)
    return projects
  }, [projects, user])

  // useCallback: stable filter-tab handler, same pattern used elsewhere
  // in the app for click handlers passed down to repeated elements.
  const handleFilterChange = useCallback((key) => {
    setActiveFilter(key)
  }, [])

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  // useMemo: filtered + searched project list, only recomputed when its
  // real inputs change — not on every unrelated re-render (theme toggle,
  // modal open/close, etc).
  const filteredProjects = useMemo(
    () =>
      roleScopedProjects.filter((project) => {
        const matchesFilter =
          activeFilter === 'all' ||
          (activeFilter === 'ongoing' && project.status === 'Ongoing') ||
          (activeFilter === 'completed' && project.status === 'Completed') ||
          (activeFilter === 'onhold' && project.status === 'On Hold') ||
          (activeFilter === 'delayed' && project.status === 'Delayed')

        const term = searchTerm.trim().toLowerCase()
        const matchesSearch =
          term === '' ||
          project.name.toLowerCase().includes(term) ||
          project.customerName.toLowerCase().includes(term) ||
          project.designer.toLowerCase().includes(term)

        return matchesFilter && matchesSearch
      }),
    [roleScopedProjects, activeFilter, searchTerm]
  )

  // useMemo: summary stats derived from the role-scoped list, so an admin
  // sees portfolio-wide numbers while a designer/contractor/customer see
  // numbers for only what belongs to them.
  const stats = useMemo(() => {
    const total = roleScopedProjects.length
    const ongoing = roleScopedProjects.filter((p) => p.status === 'Ongoing').length
    const completed = roleScopedProjects.filter((p) => p.status === 'Completed').length
    const delayed = roleScopedProjects.filter((p) => p.status === 'Delayed').length
    return { total, ongoing, completed, delayed }
  }, [roleScopedProjects])

  // useMemo: looks the selected project up fresh from the shared context
  // list every render — so if its stage is advanced while the modal is
  // open, the modal shows the new stage immediately instead of a stale copy.
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  )

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.projectsPageTitle}</h2>
          <p>{t.projectsPageSubtitle}</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineFolderOpen />} value={stats.total} label={t.totalProjects || 'Total Projects'} />
        <SummaryCard icon={<MdOutlineAutorenew />} value={stats.ongoing} label={t.ongoing} />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.completed} label={t.completed} />
        <SummaryCard icon={<MdOutlineErrorOutline />} value={stats.delayed} label={t.delayed} />
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.allProjects}</h3>
          <div className="directory-search" onClick={handleSearchFocus}>
            <MdOutlineSearch />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchProjectsPlaceholder || 'Search projects by name, customer or designer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allProjects },
            { key: 'ongoing', label: t.ongoing },
            { key: 'completed', label: t.completed },
            { key: 'delayed', label: t.delayed },
            { key: 'onhold', label: t.onHold }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`filter-tab${activeFilter === tab.key ? ' is-active' : ''}`}
              onClick={() => handleFilterChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div className="customer-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewProject={(p) => setSelectedProjectId(p.id)} />
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onAdvanceStage={advanceProjectStage}
        />
      )}
    </div>
  )
}
