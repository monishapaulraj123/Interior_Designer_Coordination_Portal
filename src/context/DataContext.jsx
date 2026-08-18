import React, { createContext, useCallback, useMemo, useState } from 'react'
import {
  SAMPLE_CUSTOMERS,
  SAMPLE_PROJECTS,
  PROJECT_STAGES,
  progressPercentFromStage
} from '../data/sampleData.js'

// This is the single source of truth for customers + projects across the
// WHOLE app (Dashboard, Customers, Designers, Contractors, Projects,
// Quotations, Payments, Appointments). Previously every page loaded its
// own private copy of the sample data via useEffect, so an update made on
// one page (e.g. advancing a project's stage) never showed up anywhere
// else. Lifting this state up into one Context — and having every page
// read/write through it — is what makes "Customer -> Project -> Designer
// -> Contractor -> Stage" stay identical no matter which page it's
// viewed from.
export const DataContext = createContext(null)

export function DataProvider({ children }) {
  // useState: the one shared list of customers. Adding/deleting a
  // customer here is immediately visible on every page that reads it.
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)

  // useState: the one shared list of projects. This is what Customer
  // detail, Designer detail, Contractor detail, the Projects grid, and
  // the Dashboard stats all read from — there is no second copy anywhere.
  const [projects, setProjects] = useState(SAMPLE_PROJECTS)

  // useCallback: adds a new customer (used by Customers.jsx's Add
  // Customer form) to the shared list.
  const addCustomer = useCallback((customer) => {
    setCustomers((prev) => [customer, ...prev])
  }, [])

  // useCallback: removes a customer from the shared list.
  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // useCallback: adds a brand-new project (e.g. auto-created alongside a
  // new customer) to the shared list.
  const addProject = useCallback((project) => {
    setProjects((prev) => [project, ...prev])
  }, [])

  // useCallback: advances one project to its next pipeline stage. Because
  // `projects` lives in this shared Context, this single update is what
  // Customer/Designer/Contractor/Project/Dashboard all see at once —
  // React state only, no backend involved.
  const advanceProjectStage = useCallback((projectId) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project
        const nextIndex = Math.min(project.currentStageIndex + 1, PROJECT_STAGES.length - 1)
        const nextStageName = PROJECT_STAGES[nextIndex]
        const isComplete = nextIndex === PROJECT_STAGES.length - 1
        return {
          ...project,
          currentStageIndex: nextIndex,
          currentStage: nextStageName,
          nextStage: PROJECT_STAGES[nextIndex + 1] || null,
          progress: progressPercentFromStage(nextIndex),
          status: isComplete ? 'Completed' : project.status === 'Delayed' ? 'Delayed' : 'Ongoing'
        }
      })
    )
  }, [])

  // useCallback: lets a project be moved back to an earlier stage too
  // (e.g. correcting a mistaken advance), same shared-state pattern.
  const revertProjectStage = useCallback((projectId) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project
        const prevIndex = Math.max(project.currentStageIndex - 1, 0)
        return {
          ...project,
          currentStageIndex: prevIndex,
          currentStage: PROJECT_STAGES[prevIndex],
          nextStage: PROJECT_STAGES[prevIndex + 1] || null,
          progress: progressPercentFromStage(prevIndex),
          status: project.status === 'Delayed' ? 'Delayed' : 'Ongoing'
        }
      })
    )
  }, [])

  // useMemo: the Context value object itself, so consumers don't get a
  // brand-new object (and re-render unnecessarily) on every parent render.
  const value = useMemo(
    () => ({
      customers,
      setCustomers,
      addCustomer,
      deleteCustomer,
      projects,
      setProjects,
      addProject,
      advanceProjectStage,
      revertProjectStage
    }),
    [customers, projects, addCustomer, deleteCustomer, addProject, advanceProjectStage, revertProjectStage]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
