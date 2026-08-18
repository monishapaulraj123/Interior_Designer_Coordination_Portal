import React, { useContext } from 'react'
import { MdCheckCircle, MdRadioButtonUnchecked, MdOutlineTimelapse } from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { PROJECT_STAGES, stageStatus } from '../data/sampleData.js'

const STAGE_ICON = {
  completed: MdCheckCircle,
  'in-progress': MdOutlineTimelapse,
  upcoming: MdRadioButtonUnchecked
}

// Shared, read-only stage-by-stage timeline — used by ProjectDetailModal,
// CustomerDetailModal, DesignerDetailModal and ContractorDetailModal so
// every one of those "View Details" screens renders the exact same
// pipeline for a given project, driven by the exact same
// `currentStageIndex` from the shared DataContext.
export default function StageTimeline({ currentStageIndex }) {
  const { t } = useContext(ThemeContext)

  return (
    <div className="stage-timeline">
      {PROJECT_STAGES.map((stage, index) => {
        const status = stageStatus(index, currentStageIndex)
        const Icon = STAGE_ICON[status]
        return (
          <div key={stage} className={`stage-timeline-item ${status}`}>
            <span className="stage-dot">
              <Icon size={13} />
            </span>
            <div className="stage-timeline-item-body">
              <span className="stage-timeline-item-name">{stage}</span>
              <span className={`stage-status-label ${status}`}>
                {status === 'completed' ? t.completed : status === 'in-progress' ? t.ongoing : t.upcoming || 'Upcoming'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
