import React, { useContext } from 'react'
import {
  MdOutlinePhone,
  MdOutlineEmail,
  MdOutlineLocationOn,
  MdOutlineBadge,
  MdDeleteOutline
} from 'react-icons/md'
import { ThemeContext } from '../context/ThemeContext.jsx'

const STATUS_CLASS = {
  Active: 'status-active',
  Completed: 'status-completed',
  Inactive: 'status-inactive'
}

export default function CustomerCard({ customer, onDelete, onViewDetails }) {
  const { t } = useContext(ThemeContext)

  // Status values are stored as fixed English keys ("Active" / "Completed" /
  // "Inactive") in the data, but the label shown to the user is translated.
  const STATUS_LABEL = {
    Active: t.active,
    Completed: t.completed,
    Inactive: t.inactive
  }

  return (
    <div className="customer-card">
      <div className="customer-photo">
        <img src={customer.photo} alt={customer.projectType} loading="lazy" />
      </div>

      <div className="customer-card-body">
        <div className="customer-card-title-row">
          <div>
            <div className="customer-name">{customer.name}</div>
            <div className="customer-id">{customer.customerId}</div>
          </div>
          <span className={`status-pill ${STATUS_CLASS[customer.status] || 'status-active'}`}>
            {STATUS_LABEL[customer.status] || customer.status}
          </span>
        </div>

        <div className="customer-project-type">{customer.projectType}</div>

        <ul className="customer-meta-list">
          <li>
            <MdOutlineLocationOn /> {customer.location}
          </li>
          <li>
            <MdOutlineBadge /> {customer.designer}
          </li>
          <li>
            <MdOutlinePhone /> {customer.phone}
          </li>
          <li>
            <MdOutlineEmail /> {customer.email}
          </li>
        </ul>

        <div className="customer-card-footer">
          <button type="button" className="btn-view-details" onClick={() => onViewDetails(customer)}>
            {t.viewDetails}
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(customer.id)}
            aria-label={`${t.delete} ${customer.name}`}
            title={t.delete}
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  )
}
