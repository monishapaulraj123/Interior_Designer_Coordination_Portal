import React, { useContext, useMemo, useState } from 'react'
import {
  MdOutlineEngineering,
  MdOutlineCheckCircle,
  MdOutlineHandyman,
  MdOutlineEmojiEvents,
  MdStar,
  MdOutlinePhone,
  MdOutlineEmail
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import ContractorDetailModal from '../components/ContractorDetailModal.jsx'
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'
import { SAMPLE_CONTRACTORS } from '../data/sampleData.js'

const STATUS_CLASS = { Active: 'status-active', 'On Hold': 'status-inactive' }

export default function Contractors() {
  // useContext: shared language strings + theme, and the shared projects
  // list + stage-advance action — so "Apex Constructions -> View Details"
  // shows the SAME projects/stages as the Customers and Projects pages.
  const { t } = useContext(ThemeContext)
  const { projects, advanceProjectStage } = useContext(DataContext)

  const [selectedContractor, setSelectedContractor] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  // useMemo: derived summary counts, only recomputed when the roster or
  // the shared project list changes.
  const stats = useMemo(
    () => ({
      total: SAMPLE_CONTRACTORS.length,
      active: SAMPLE_CONTRACTORS.filter((c) => c.status === 'Active').length,
      ongoing: projects.filter((p) => p.status === 'Ongoing').length,
      completed: projects.filter((p) => p.status === 'Completed').length
    }),
    [projects]
  )

  // useMemo: looks the selected project up fresh from shared context every
  // render, so advancing its stage updates this view live.
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  )

  const handleViewProjectFromContractor = (project) => {
    setSelectedProjectId(project.id)
  }

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.pageTitleContractors || 'Contractor Management'}</h2>
          <p>{t.contractorsPageSubtitle}</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineEngineering />} value={stats.total} label={t.totalContractors} />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.active} label={t.activeContractors} />
        <SummaryCard icon={<MdOutlineHandyman />} value={stats.ongoing} label={t.ongoingWorks} />
        <SummaryCard icon={<MdOutlineEmojiEvents />} value={stats.completed} label={t.completedWorks} />
      </div>

      <div className="directory-panel">
        <div className="customer-grid">
          {SAMPLE_CONTRACTORS.map((c) => {
            const assignedProject = projects.find((p) => p.contractor === c.name)
            return (
              <div className="customer-card" key={c.id}>
                <div className="customer-photo" style={{ position: 'relative' }}>
                  <img src={c.photo} alt={c.name} loading="lazy" />
                  <span className={`status-pill ${STATUS_CLASS[c.status] || 'status-active'}`} style={{ position: 'absolute', top: 14, right: 14 }}>
                    {t[c.status] || c.status}
                  </span>
                </div>
                <div className="customer-card-body">
                  <div className="customer-name">{c.name}</div>
                  <div className="customer-project-type">{t.contactPersonLabel}: {c.contactPerson}</div>
                  <ul className="customer-meta-list">
                    <li>{t.currentProjectLabel || 'Current Project'}: <strong>{assignedProject?.name || c.currentProject}</strong></li>
                    <li>{t.experienceLabel}: <strong>{c.experience}</strong></li>
                    <li><MdStar /> {c.rating} / 5.0 {t.ratingLabel}</li>
                    <li><MdOutlinePhone /> {c.phone}</li>
                    <li><MdOutlineEmail /> {c.email}</li>
                  </ul>
                  <div className="customer-card-footer">
                    <button type="button" className="btn-view-details" onClick={() => setSelectedContractor(c)}>
                      {t.viewProfile}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedContractor && (
        <ContractorDetailModal
          contractor={selectedContractor}
          onClose={() => setSelectedContractor(null)}
          onViewProject={handleViewProjectFromContractor}
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
