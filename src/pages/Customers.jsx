import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  MdOutlineGroups,
  MdOutlinePersonOutline,
  MdOutlineTrendingUp,
  MdOutlineFactCheck,
  MdAdd,
  MdClose
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { DataContext } from '../context/DataContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import CustomerCard from '../components/CustomerCard.jsx'
import CustomerDetailModal from '../components/CustomerDetailModal.jsx'
import { getImageForProjectType, getImageForProject } from '../assets/images/index.js'
import { SAMPLE_DESIGNERS, SAMPLE_CONTRACTORS, PROJECT_STAGES } from '../data/sampleData.js'

// Field set mirrors tbl_Customer from the DB design: identity + contact +
// property/project details + budget + timeline + requirements + the
// designer/contractor assignment that seeds the linked project.
const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  location: '',
  propertyType: '',
  projectType: '',
  budget: '',
  startDate: '',
  endDate: '',
  requirements: '',
  designer: '',
  contractor: '',
  status: 'Active'
}

export default function Customers() {
  // useContext: pulls the active language strings + theme, the logged-in
  // user (designers only see their own assigned customers), and the
  // shared customers/projects lists + mutators from DataContext — the
  // SAME lists every other page (Dashboard, Designers, Contractors,
  // Projects) reads from.
  const { t } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { customers, addCustomer, deleteCustomer, addProject } = useContext(DataContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // useRef: holds a direct handle to the search <input> DOM node so we can
  // programmatically focus it without triggering a re-render.
  const searchInputRef = useRef(null)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // useCallback: "Clear Search" is passed down as a prop-friendly, stable
  // function so it never causes unrelated child re-renders.
  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    searchInputRef.current?.focus()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // useCallback: "Reset Form" clears both the form fields and any validation
  // message, and is reused by both the modal's close (X) and Cancel buttons.
  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setFormError('')
    setIsModalOpen(false)
  }, [])

  // useCallback: "Add Customer" validates the form, then adds a new
  // customer AND a matching linked project (Customer -> Project, the same
  // relationship every other page relies on) to the shared DataContext
  // lists — the UI updates immediately via React state everywhere, no
  // page reload/backend call.
  const handleAddCustomer = useCallback(
    (e) => {
      e.preventDefault()
      if (!form.name.trim()) {
        setFormError(t.nameRequired)
        return
      }

      const newCustomerId = Date.now()
      const resolvedProjectType = form.projectType.trim() || 'Residential Interior'

      const newCustomer = {
        ...form,
        budget: Number(form.budget) || 0,
        id: newCustomerId,
        customerId: `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
        photo: getImageForProjectType(resolvedProjectType)
      }

      // The new project is named "<Customer> - <Project Type>" (e.g.
      // "Alish - Modular Kitchen") and starts at the first pipeline
      // stage, exactly like every other seeded project.
      const newProject = {
        id: Date.now() + 1,
        projectId: `PRJ-${Math.floor(2600 + Math.random() * 900)}`,
        customerId: newCustomerId,
        name: `${form.name.trim()} - ${resolvedProjectType}`,
        customerName: form.name.trim(),
        projectType: resolvedProjectType,
        designer: form.designer || '',
        contractor: form.contractor || '',
        location: form.location || '',
        budget: Number(form.budget) || 0,
        startDate: form.startDate || new Date().toISOString().slice(0, 10),
        endDate: form.endDate || '',
        priority: 'Medium',
        currentStageIndex: 0,
        status: 'Ongoing',
        image: getImageForProject(resolvedProjectType),
        currentStage: PROJECT_STAGES[0],
        nextStage: PROJECT_STAGES[1],
        progress: 0
      }

      addCustomer(newCustomer)
      addProject(newProject)
      setForm(EMPTY_FORM)
      setFormError('')
      setIsModalOpen(false)
    },
    [form, t.nameRequired, addCustomer, addProject]
  )

  // useMemo: role-scoped customer list. Admin sees everyone; a designer
  // only sees the customers assigned to them — this is what "Designer ->
  // relevant customers" actually means, not just a nav-link difference.
  const roleScopedCustomers = useMemo(() => {
    if (user?.role === 'designer') {
      return customers.filter((c) => c.designer === user.designerName)
    }
    return customers
  }, [customers, user])

  // useMemo: the filtered/searched customer list is only recalculated when
  // the underlying customers array, the search text, or the active tab change
  // — not on every render (e.g. when the theme or language toggles).
  const filteredCustomers = useMemo(
    () =>
      roleScopedCustomers
        .filter((customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((customer) => {
          if (activeFilter === 'all') return true
          if (activeFilter === 'active') return customer.status === 'Active'
          if (activeFilter === 'inactive') return customer.status === 'Inactive'
          if (activeFilter === 'new') return customer.id > 8 && customer.id < 1000000
          return true
        }),
    [roleScopedCustomers, searchTerm, activeFilter]
  )

  const totalCustomers = roleScopedCustomers.length
  const activeCustomers = roleScopedCustomers.filter((c) => c.status === 'Active').length
  const completedProjects = roleScopedCustomers.filter((c) => c.status === 'Completed').length
  const pendingQuotations = roleScopedCustomers.filter((c) => c.status === 'Inactive').length

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.pageTitle}</h2>
          <p>{t.pageSubtitle}</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'designer') && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <MdAdd /> {t.addCustomer}
          </button>
        )}
      </div>

      <div className="summary-grid">
        <SummaryCard
          icon={<MdOutlineGroups />}
          value={totalCustomers}
          label={t.totalCustomers}
          trend="+12%"
        />
        <SummaryCard
          icon={<MdOutlineTrendingUp />}
          value={activeCustomers}
          label={t.activeCustomers}
          trend="+8%"
        />
        <SummaryCard
          icon={<MdOutlinePersonOutline />}
          value={completedProjects}
          label={t.completedProjects}
          trend="+5%"
        />
        <SummaryCard
          icon={<MdOutlineFactCheck />}
          value={pendingQuotations}
          label={t.pendingQuotations}
          trend="+3%"
        />
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.customerDirectory}</h3>
          <div className="directory-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchCustomers}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label={t.clearSearch}
                title={t.clearSearch}
              >
                <MdClose />
              </button>
            )}
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allCustomers },
            { key: 'active', label: t.active },
            { key: 'inactive', label: t.inactive },
            { key: 'new', label: t.newCustomers }
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

        {filteredCustomers.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div className="customer-grid">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onDelete={deleteCustomer}
                onViewDetails={setSelectedCustomer}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleResetForm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.addCustomer}</h3>
              <button
                className="modal-close"
                onClick={handleResetForm}
                aria-label={t.closeModal}
                title={t.closeModal}
              >
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleAddCustomer}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>{t.customerNameLabel}</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
                  {formError && <span className="form-error">{formError}</span>}
                </div>
                <div className="form-field">
                  <label>{t.emailLabel}</label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.phoneLabel}</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleFormChange} />
                </div>
                <div className="form-field full-width">
                  <label>{t.addressLabel}</label>
                  <input type="text" name="address" value={form.address} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.locationLabel}</label>
                  <input type="text" name="location" value={form.location} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.propertyTypeLabel}</label>
                  <input type="text" name="propertyType" value={form.propertyType} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.projectTypeLabel}</label>
                  <input
                    type="text"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleFormChange}
                    placeholder="e.g. Modular Kitchen"
                  />
                </div>
                <div className="form-field">
                  <label>{t.budgetRupeesLabel}</label>
                  <input type="number" name="budget" min="0" value={form.budget} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.startDateLabel}</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.endDateLabel}</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} />
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
                  <label>{t.contractorLabel}</label>
                  <select name="contractor" value={form.contractor} onChange={handleFormChange}>
                    <option value="">—</option>
                    {SAMPLE_CONTRACTORS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>{t.statusLabel}</label>
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Active">{t.active}</option>
                    <option value="Completed">{t.completed}</option>
                    <option value="Inactive">{t.inactive}</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>{t.requirementsLabel}</label>
                  <input type="text" name="requirements" value={form.requirements} onChange={handleFormChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleResetForm}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn-primary">
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={
            // Always resolve the latest copy from context so the modal
            // reflects any edits made elsewhere while it's open.
            customers.find((c) => c.id === selectedCustomer.id) || selectedCustomer
          }
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}
