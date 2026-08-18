import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MdOutlineLocalShipping,
  MdOutlineCheckCircle,
  MdOutlineSchedule,
  MdOutlineInventory,
  MdAdd,
  MdClose,
  MdOutlineSearch,
  MdStar
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { SAMPLE_SUPPLIERS } from '../data/sampleData.js'
import { getImageForProjectType } from '../assets/images/index.js'

const STATUS_CLASS = {
  'On Time': 'status-active',
  Delivered: 'status-completed',
  'In Transit': 'status-inactive',
  Pending: 'status-inactive'
}

const EMPTY_FORM = { name: '', category: '', contactPerson: '', phone: '', email: '', materialsSupplied: '' }

export default function Suppliers() {
  // useContext: shared language strings + theme.
  const { t } = useContext(ThemeContext)

  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const searchInputRef = useRef(null)

  // useEffect: loads the supplier directory from local sample data once.
  useEffect(() => {
    setSuppliers(SAMPLE_SUPPLIERS)
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // useCallback: resets/closes the Add Supplier modal.
  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setIsModalOpen(false)
  }, [])

  // useCallback: adds a new supplier to local state only (frontend-only
  // sample data), immediately reflected in the UI via React state.
  const handleAddSupplier = useCallback(
    (e) => {
      e.preventDefault()
      if (!form.name.trim()) return
      const newSupplier = {
        ...form,
        id: Date.now(),
        supplierId: `SUP-${Math.floor(6500 + Math.random() * 900)}`,
        rating: 4.5,
        deliveryStatus: 'Pending',
        materialsSupplied: form.materialsSupplied
          ? form.materialsSupplied.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        photo: getImageForProjectType(form.category)
      }
      setSuppliers((prev) => [newSupplier, ...prev])
      handleResetForm()
    },
    [form, handleResetForm]
  )

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  // useMemo: filtered supplier list, recomputed only when its real inputs change.
  const filteredSuppliers = useMemo(
    () =>
      suppliers
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((s) => {
          if (activeFilter === 'all') return true
          if (activeFilter === 'active') return s.deliveryStatus === 'On Time' || s.deliveryStatus === 'In Transit'
          if (activeFilter === 'pending') return s.deliveryStatus === 'Pending'
          if (activeFilter === 'completed') return s.deliveryStatus === 'Delivered'
          return true
        }),
    [suppliers, searchTerm, activeFilter]
  )

  const stats = useMemo(
    () => ({
      total: suppliers.length,
      active: suppliers.filter((s) => s.deliveryStatus !== 'Pending').length,
      pending: suppliers.filter((s) => s.deliveryStatus === 'Pending').length,
      completed: suppliers.filter((s) => s.deliveryStatus === 'Delivered').length
    }),
    [suppliers]
  )

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.suppliersPageTitle}</h2>
          <p>{t.suppliersPageSubtitle}</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <MdAdd /> {t.addSupplier}
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineLocalShipping />} value={stats.total} label={t.totalSuppliers} trend="+6.2%" />
        <SummaryCard icon={<MdOutlineCheckCircle />} value={stats.active} label={t.activeSuppliers} trend="+4.1%" />
        <SummaryCard icon={<MdOutlineSchedule />} value={stats.pending} label={t.pendingDeliveries} />
        <SummaryCard icon={<MdOutlineInventory />} value={stats.completed} label={t.completedDeliveries} trend="+11.3%" />
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.supplierDirectory}</h3>
          <div className="directory-search" onClick={handleSearchFocus}>
            <MdOutlineSearch />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchSuppliers}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allSuppliers || 'All Suppliers' },
            { key: 'active', label: t.active },
            { key: 'pending', label: t.pending },
            { key: 'completed', label: t.completed }
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

        {filteredSuppliers.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div className="customer-grid">
            {filteredSuppliers.map((s) => (
              <div className="customer-card" key={s.id}>
                <div className="customer-photo">
                  <img src={s.photo} alt={s.name} loading="lazy" />
                </div>
                <div className="customer-card-body">
                  <div className="customer-card-title-row">
                    <div>
                      <div className="customer-name">{s.name}</div>
                      <div className="customer-id">{s.category}</div>
                    </div>
                    <span className={`status-pill ${STATUS_CLASS[s.deliveryStatus] || 'status-active'}`}>
                      {t[s.deliveryStatus] || s.deliveryStatus}
                    </span>
                  </div>

                  <ul className="customer-meta-list">
                    <li><MdStar /> {s.rating} / 5.0 {t.ratingLabel}</li>
                    <li>{t.contactPersonLabel}: {s.contactPerson}</li>
                    <li>{s.phone}</li>
                    <li>{s.email}</li>
                  </ul>

                  <div className="table-cell-subtitle" style={{ marginBottom: 4 }}>{t.materialsSuppliedLabel}</div>
                  <div className="chip-row">
                    {s.materialsSupplied.map((mat) => (
                      <span className="chip" key={mat}>{mat}</span>
                    ))}
                  </div>

                  <div className="customer-card-footer">
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
              <h3>{t.addSupplier}</h3>
              <button className="modal-close" onClick={handleResetForm} aria-label={t.closeModal}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleAddSupplier}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>{t.supplierLabel} {t.customerNameLabel}</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
                </div>
                <div className="form-field">
                  <label>{t.categoryLabel}</label>
                  <input type="text" name="category" value={form.category} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.contactPersonLabel}</label>
                  <input type="text" name="contactPerson" value={form.contactPerson} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.phoneLabel}</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.emailLabel}</label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} />
                </div>
                <div className="form-field full-width">
                  <label>{t.materialsSuppliedLabel} (comma separated)</label>
                  <input type="text" name="materialsSupplied" value={form.materialsSupplied} onChange={handleFormChange} />
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
