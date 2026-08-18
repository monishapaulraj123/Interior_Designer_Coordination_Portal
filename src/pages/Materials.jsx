import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MdOutlineInventory2,
  MdOutlineWarningAmber,
  MdOutlineBlock,
  MdOutlineAutoAwesome,
  MdAdd,
  MdClose,
  MdOutlineSearch
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { SAMPLE_MATERIALS, SAMPLE_SUPPLIERS } from '../data/sampleData.js'
import { getImageForProjectType } from '../assets/images/index.js'

const STOCK_CLASS = {
  'In Stock': 'status-active',
  'Low Stock': 'status-inactive',
  'Out of Stock': 'status-inactive',
  'New Arrival': 'status-completed'
}

const EMPTY_FORM = {
  name: '',
  category: '',
  supplier: '',
  unitPrice: '',
  unit: 'sq.ft',
  quantityAvailable: '',
  stock: 'In Stock'
}

export default function Materials() {
  // useContext: shared language strings + theme.
  const { t } = useContext(ThemeContext)

  const [materials, setMaterials] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const searchInputRef = useRef(null)

  // useEffect: loads the material catalogue from local sample data once,
  // when the page mounts.
  useEffect(() => {
    setMaterials(SAMPLE_MATERIALS)
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // useCallback: resets and closes the Add Material modal — reused by the
  // header close (X) and the Cancel button.
  const handleResetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setIsModalOpen(false)
  }, [])

  // useCallback: adds a new material to local state only (frontend-only
  // sample data, no backend) and updates the UI immediately.
  const handleAddMaterial = useCallback(
    (e) => {
      e.preventDefault()
      if (!form.name.trim()) return
      const newMaterial = {
        ...form,
        id: Date.now(),
        sku: `MAT-${Math.floor(8800 + Math.random() * 900)}`,
        unitPrice: Number(form.unitPrice) || 0,
        quantityAvailable: Number(form.quantityAvailable) || 0,
        photo: getImageForProjectType(form.category)
      }
      setMaterials((prev) => [newMaterial, ...prev])
      handleResetForm()
    },
    [form, handleResetForm]
  )

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  // useMemo: filtered material list, recomputed only when the source data,
  // search term, or active stock-tab actually change.
  const filteredMaterials = useMemo(
    () =>
      materials
        .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.category.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((m) => {
          if (activeFilter === 'all') return true
          if (activeFilter === 'in-stock') return m.stock === 'In Stock'
          if (activeFilter === 'low-stock') return m.stock === 'Low Stock'
          if (activeFilter === 'out-of-stock') return m.stock === 'Out of Stock'
          if (activeFilter === 'new') return m.stock === 'New Arrival'
          return true
        }),
    [materials, searchTerm, activeFilter]
  )

  const stats = useMemo(
    () => ({
      total: materials.length,
      low: materials.filter((m) => m.stock === 'Low Stock').length,
      out: materials.filter((m) => m.stock === 'Out of Stock').length,
      newArrivals: materials.filter((m) => m.stock === 'New Arrival').length
    }),
    [materials]
  )

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2>{t.pageTitleMaterials || 'Material Management'}</h2>
          <p>{t.materialsPageSubtitle}</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <MdAdd /> {t.addMaterial}
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={<MdOutlineInventory2 />} value={stats.total} label={t.totalMaterials} trend="+9%" />
        <SummaryCard icon={<MdOutlineWarningAmber />} value={stats.low} label={t.lowStock} />
        <SummaryCard icon={<MdOutlineBlock />} value={stats.out} label={t.outOfStock} />
        <SummaryCard icon={<MdOutlineAutoAwesome />} value={stats.newArrivals} label={t.newArrivals} trend="+32%" />
      </div>

      <div className="directory-panel">
        <div className="directory-header">
          <h3>{t.materialInventory}</h3>
          <div className="directory-search" onClick={handleSearchFocus}>
            <MdOutlineSearch />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchMaterials}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: t.allMaterials || 'All Materials' },
            { key: 'in-stock', label: t.inStock },
            { key: 'low-stock', label: t.lowStock },
            { key: 'out-of-stock', label: t.outOfStock },
            { key: 'new', label: t.newArrivals }
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

        {filteredMaterials.length === 0 ? (
          <div className="empty-state">{t.emptyState}</div>
        ) : (
          <div className="customer-grid">
            {filteredMaterials.map((material) => (
              <div className="customer-card" key={material.id}>
                <div className="customer-photo">
                  <img src={material.photo} alt={material.name} loading="lazy" />
                </div>
                <div className="customer-card-body">
                  <div className="customer-card-title-row">
                    <div>
                      <div className="customer-name">{material.name}</div>
                      <div className="customer-id">{material.category}</div>
                    </div>
                    <span className={`status-pill ${STOCK_CLASS[material.stock] || 'status-active'}`}>
                      {t[material.stock] || material.stock}
                    </span>
                  </div>
                  <div className="customer-project-type">{material.supplier}</div>
                  <div className="card-grid-photo-price">
                    <span className="card-price">₹{Number(material.unitPrice).toLocaleString('en-IN')} / {material.unit}</span>
                  </div>
                  <div className="table-cell-subtitle">
                    {material.quantityAvailable} {material.unit} {t.availableLabel || 'available'}
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
              <h3>{t.addMaterial}</h3>
              <button className="modal-close" onClick={handleResetForm} aria-label={t.closeModal}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleAddMaterial}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>{t.materialNameLabel}</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
                </div>
                <div className="form-field">
                  <label>{t.categoryLabel}</label>
                  <input type="text" name="category" value={form.category} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.supplierLabel}</label>
                  <select name="supplier" value={form.supplier} onChange={handleFormChange}>
                    <option value="">—</option>
                    {SAMPLE_SUPPLIERS.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>{t.unitPriceLabel}</label>
                  <input type="number" name="unitPrice" min="0" value={form.unitPrice} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.unitLabel || 'Unit'}</label>
                  <select name="unit" value={form.unit} onChange={handleFormChange}>
                    <option value="sq.ft">sq.ft</option>
                    <option value="unit">unit</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>{t.quantityLabel}</label>
                  <input type="number" name="quantityAvailable" min="0" value={form.quantityAvailable} onChange={handleFormChange} />
                </div>
                <div className="form-field">
                  <label>{t.stockLabel}</label>
                  <select name="stock" value={form.stock} onChange={handleFormChange}>
                    <option value="In Stock">{t.inStock}</option>
                    <option value="Low Stock">{t.lowStock}</option>
                    <option value="Out of Stock">{t.outOfStock}</option>
                    <option value="New Arrival">{t.newArrivals}</option>
                  </select>
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
