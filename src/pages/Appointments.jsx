import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MdOutlineEventAvailable,
  MdOutlineUpcoming,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdAdd,
  MdClose,
  MdOutlineSearch,
  MdChevronLeft,
  MdChevronRight,
  MdOutlinePerson,
  MdOutlineBadge,
  MdOutlineAccessTime,
  MdOutlineLocationOn
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { SAMPLE_APPOINTMENTS, SAMPLE_DESIGNERS } from '../data/sampleData.js'

const STATUS_CLASS = {
  Confirmed: 'status-active',
  Pending: 'status-inactive',
  Completed: 'status-completed',
  Cancelled: 'status-inactive'
}

const EMPTY_FORM = { projectId: '', designer: '', date: '', time: '', mode: 'In Person', tag: '' }

function isSameDay(isoDate, year, month, day) {
  const d = new Date(isoDate)
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
}

export default function Appointments() {
  // useContext: shared language strings, theme, and the logged-in user
  // (customers/designers only see appointments tied to them).
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { projects } = useContext(DataContext)

  const [appointments, setAppointments] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [calendarCursor, setCalendarCursor] = useState(() => new Date(2026, 6, 1)) // July 2026, matches sample data
  const [selectedDay, setSelectedDay] = useState(null)
  const searchInputRef = useRef(null)

  // useEffect: loads appointments from local sample data once, on mount.
  useEffect(() => {
    setAppointments(SAMPLE_APPOINTMENTS)
  }, [])

  // useMemo: role-scoped appointments — customer sees only their own
  // project's appointments, designer sees only their own meetings.
  const roleScopedAppointments = useMemo(() => {
    if (user?.role === 'customer') {
      const myProject = projects.find((p) => p.customerId === user.customerId)
      return appointments.filter((a) => a.projectId === myProject?.id)
    }
    if (user?.role === 'designer') {
      return appointments.filter((a) => a.designer === user.designerName)
    }
    return appointments
  }, [appointments, user, projects])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setIsModalOpen(false)
  }, [])

  // useCallback: schedules a new appointment into local React state only.
  const handleScheduleAppointment = useCallback(
    (e) => {
      e.preventDefault()
      const project = projects.find((p) => String(p.id) === String(form.projectId))
      if (!project || !form.date || !form.time) return
      const newAppointment = {
        id: Date.now(),
        projectId: project.id,
        customerName: project.customerName,
        projectName: project.name,
        designer: form.designer || project.designer,
        date: form.date,
        time: form.time,
        mode: form.mode,
        location: form.mode === 'Virtual Meeting' ? 'Virtual Meeting' : form.mode === 'Site Visit' ? 'Project Site' : 'IDCP Design Studio',
        tag: form.tag || 'Project Discussion',
        status: 'Pending'
      }
      setAppointments((prev) => [newAppointment, ...prev])
      handleResetForm()
    },
    [form, handleResetForm, projects]
  )

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  // useMemo: filtered + searched appointment list.
  const filteredAppointments = useMemo(
    () =>
      roleScopedAppointments
        .filter((a) => {
          const term = searchTerm.trim().toLowerCase()
          return (
            term === '' ||
            a.customerName.toLowerCase().includes(term) ||
            a.projectName.toLowerCase().includes(term) ||
            a.designer.toLowerCase().includes(term)
          )
        })
        .filter((a) => {
          if (activeFilter === 'all') return true
          if (activeFilter === 'today') return a.date === '2026-07-20'
          return a.status.toLowerCase() === activeFilter
        })
        .sort((a, b) => new Date(`${a.date}T00:00`) - new Date(`${b.date}T00:00`)),
    [roleScopedAppointments, searchTerm, activeFilter]
  )

  const stats = useMemo(
    () => ({
      today: roleScopedAppointments.filter((a) => a.date === '2026-07-20').length,
      upcoming: roleScopedAppointments.filter((a) => new Date(a.date) >= new Date('2026-07-16') && a.status !== 'Cancelled').length,
      completed: roleScopedAppointments.filter((a) => a.status === 'Completed').length,
      cancelled: roleScopedAppointments.filter((a) => a.status === 'Cancelled').length
    }),
    [roleScopedAppointments]
  )

  // useMemo: calendar grid cells for the currently viewed month, with a
  // flag for whether any appointment falls on that day (drives the dot).
  const calendarCells = useMemo(() => {
    const year = calendarCursor.getFullYear()
    const month = calendarCursor.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells = []
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, muted: true })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const hasAppointment = roleScopedAppointments.some((a) => isSameDay(a.date, year, month, day))
      cells.push({ day, muted: false, hasAppointment })
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: cells.length, muted: true })
    }
    return cells
  }, [calendarCursor, roleScopedAppointments])

  const handlePrevMonth = useCallback(() => {
    setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])
  const handleNextMonth = useCallback(() => {
    setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const monthLabel = calendarCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.appointmentsPageTitle}</h2>
          <p>{t.appointmentsPageSubtitle}</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <MdAdd /> {t.scheduleAppointment}
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineEventAvailable />} value={stats.today} label={t.todaysAppointments} />
        <SummaryCard icon={<MdOutlineUpcoming />} value={stats.upcoming} label={t.upcoming} trend="+7.5%" />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.completed} label={t.completed} trend="+12.8%" />
        <SummaryCard icon={<MdOutlineCancel />} value={stats.cancelled} label={t.cancelled} />
      </div>

      <div className="appointments-layout">
        <div className="directory-panel">
          <div className="directory-header">
            <h3>{t.appointmentSchedule}</h3>
            <div className="directory-search" onClick={handleSearchFocus}>
              <MdOutlineSearch />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.searchAppointments}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-tabs">
            {[
              { key: 'all', label: t.allAppointments || 'All Appointments' },
              { key: 'today', label: t.today || 'Today' },
              { key: 'confirmed', label: t.confirmed },
              { key: 'completed', label: t.completed },
              { key: 'cancelled', label: t.cancelled }
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

          {filteredAppointments.length === 0 ? (
            <div className="empty-state">{t.emptyState}</div>
          ) : (
            <div className="customer-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filteredAppointments.map((a) => (
                <div className="customer-card" key={a.id}>
                  <div className="customer-card-body" style={{ paddingTop: 20 }}>
                    <div className="customer-card-title-row">
                      <div>
                        <div className="customer-name">{a.customerName}</div>
                        <div className="customer-id">{a.projectName}</div>
                      </div>
                      <span className={`status-pill ${STATUS_CLASS[a.status] || 'status-active'}`}>
                        {t[a.status] || a.status}
                      </span>
                    </div>
                    <ul className="customer-meta-list">
                      <li><MdOutlineBadge /> {a.designer}</li>
                      <li><MdOutlineAccessTime /> {new Date(a.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} · {a.time}</li>
                      <li><MdOutlineLocationOn /> {a.location}</li>
                    </ul>
                    <span className="current-stage-chip">{a.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mini-calendar">
          <div className="mini-calendar-header">
            <h4>{monthLabel}</h4>
            <div className="mini-calendar-nav">
              <button type="button" onClick={handlePrevMonth} aria-label="Previous month"><MdChevronLeft /></button>
              <button type="button" onClick={handleNextMonth} aria-label="Next month"><MdChevronRight /></button>
            </div>
          </div>
          <div className="mini-calendar-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div className="mini-calendar-dow" key={`${d}-${i}`}>{d}</div>
            ))}
            {calendarCells.map((cell, idx) => (
              <div
                key={idx}
                className={`mini-calendar-cell${cell.muted ? ' is-muted' : ''}${cell.hasAppointment ? ' has-appointment' : ''}${selectedDay === cell.day && !cell.muted ? ' is-selected' : ''}`}
                onClick={() => !cell.muted && setSelectedDay(cell.day)}
              >
                {cell.day}
              </div>
            ))}
          </div>
          <div className="mini-calendar-legend">
            <span><span className="legend-dot" /> {t.hasAppointmentsLabel || 'Has appointments'}</span>
            <span><span className="legend-dot selected" /> {t.selectedDayLabel || 'Selected day'}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleResetForm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.scheduleAppointment}</h3>
              <button className="modal-close" onClick={handleResetForm} aria-label={t.closeModal}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleScheduleAppointment}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label><MdOutlinePerson /> Project</label>
                  <select name="projectId" value={form.projectId} onChange={handleFormChange} required>
                    <option value="">—</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.customerName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>{t.designerLabel}</label>
                  <select name="designer" value={form.designer} onChange={handleFormChange}>
                    <option value="">—</option>
                    {SAMPLE_DESIGNERS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Mode</label>
                  <select name="mode" value={form.mode} onChange={handleFormChange}>
                    <option value="In Person">In Person</option>
                    <option value="Virtual Meeting">Virtual Meeting</option>
                    <option value="Site Visit">Site Visit</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleFormChange} required />
                </div>
                <div className="form-field">
                  <label>Time</label>
                  <input type="time" name="time" value={form.time} onChange={handleFormChange} required />
                </div>
                <div className="form-field full-width">
                  <label>Purpose</label>
                  <input type="text" name="tag" value={form.tag} onChange={handleFormChange} placeholder="Design Review" />
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
