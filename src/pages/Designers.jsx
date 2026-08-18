import React, { useContext, useMemo, useState } from 'react'
import {
  MdOutlineDesignServices,
  MdOutlineCheckCircle,
  MdOutlineAccessTime,
  MdOutlineEmojiEvents,
  MdStar,
  MdOutlinePhone,
  MdOutlineEmail
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import DesignerDetailModal from '../components/DesignerDetailModal.jsx'
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'
import { SAMPLE_DESIGNERS } from '../data/sampleData.js'

const STATUS_CLASS = { Available: 'status-active', Busy: 'status-inactive' }

export default function Designers() {
  // useContext: shared language strings + theme, and the shared projects
  // list + stage-advance action — this is what makes "Ananya Rao -> View
  // Details" show the SAME projects/stages as the Customers and Projects
  // pages, instead of separate unrelated data.
  const { t } = useContext(ThemeContext)
  const { projects, advanceProjectStage } = useContext(DataContext)

  const [selectedDesigner, setSelectedDesigner] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  // useMemo: derived summary counts, only recomputed when the roster or
  // the shared project list changes (active-project counts depend on it).
  const stats = useMemo(
    () => ({
      total: SAMPLE_DESIGNERS.length,
      available: SAMPLE_DESIGNERS.filter((d) => d.availability === 'Available').length,
      busy: SAMPLE_DESIGNERS.filter((d) => d.availability === 'Busy').length,
      completed: projects.filter((p) => p.status === 'Completed').length
    }),
    [projects]
  )

  // useMemo: looks the selected project up fresh from the shared context
  // list every render, so advancing its stage updates this view live.
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  )

  const handleViewProjectFromDesigner = (project) => {
    setSelectedProjectId(project.id)
  }

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.pageTitleDesigners || 'Designer Management'}</h2>
          <p>{t.designersPageSubtitle}</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineDesignServices />} value={stats.total} label={t.totalDesigners} />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.available} label={t.availableDesigners} />
        <SummaryCard icon={<MdOutlineAccessTime />} value={stats.busy} label={t.busyDesigners} />
        <SummaryCard icon={<MdOutlineEmojiEvents />} value={stats.completed} label={t.completedProjects} />
      </div>

      <div className="directory-panel">
        <div className="customer-grid">
          {SAMPLE_DESIGNERS.map((d) => {
            const assignedCount = projects.filter((p) => p.designer === d.name).length
            return (
              <div className="customer-card" key={d.id}>
                <div className="customer-photo" style={{ position: 'relative' }}>
                  <img src={d.photo} alt={d.name} loading="lazy" />
                  <span className={`status-pill ${STATUS_CLASS[d.availability]}`} style={{ position: 'absolute', top: 14, right: 14 }}>
                    {t[d.availability] || d.availability}
                  </span>
                </div>
                <div className="customer-card-body">
                  <div className="customer-name">{d.name}</div>
                  <div className="customer-project-type">{d.specialization}</div>
                  <ul className="customer-meta-list">
                    <li>{t.employeeIdLabel}: <strong>{d.designerId}</strong></li>
                    <li>{t.experienceLabel}: <strong>{d.experience}</strong></li>
                    <li>{t.activeProjectsLabel}: <strong>{assignedCount}</strong></li>
                    <li><MdStar /> {d.rating} / 5.0</li>
                    <li><MdOutlinePhone /> {d.phone}</li>
                    <li><MdOutlineEmail /> {d.email}</li>
                  </ul>
                  <div className="customer-card-footer">
                    <button type="button" className="btn-view-details" onClick={() => setSelectedDesigner(d)}>
                      {t.viewProfile}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDesigner && (
        <DesignerDetailModal
          designer={selectedDesigner}
          onClose={() => setSelectedDesigner(null)}
          onViewProject={handleViewProjectFromDesigner}
        />
      )}

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
