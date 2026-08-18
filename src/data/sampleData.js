// Realistic, relationally-linked sample data for the whole app.
// Frontend-only: everything here is in-memory sample data modeled on the
// provided DB design (tbl_Customer, tbl_Project, tbl_Designer,
// tbl_Contractor, tbl_Supplier, tbl_Material, tbl_Quotation, tbl_Payment,
// tbl_Progress, tbl_Appointment, etc.) so the shapes below mirror those
// entities and relationships without any real backend/database.
import {
  getImageForProject,
  getImageForProjectType,
  luxuryLivingRoom,
  villaInterior,
  officeInterior,
  apartmentInterior,
  modularKitchen,
  diningRoom,
  workspaceInterior,
  modernBedroom,
  commercialInterior
} from '../assets/images/index.js'

// ---------------------------------------------------------------------
// PROJECT STAGES — the fixed pipeline every project moves through.
// Mirrors tbl_Progress / tbl_Project.txt_CurrentStatus in the DB design.
// ---------------------------------------------------------------------
export const PROJECT_STAGES = [
  'Consultation',
  'Site Measurement',
  'Requirement Analysis',
  'Design',
  '3D Visualization',
  'Design Approval',
  'Quotation',
  'Material Selection',
  'Procurement',
  'Execution',
  'Installation',
  'Quality Inspection',
  'Final Handover',
  'Completed'
]

export function stageStatus(stageIndex, currentStageIndex) {
  if (stageIndex < currentStageIndex) return 'completed'
  if (stageIndex === currentStageIndex) return 'in-progress'
  return 'upcoming'
}

export function progressPercentFromStage(currentStageIndex) {
  return Math.round((currentStageIndex / (PROJECT_STAGES.length - 1)) * 100)
}

// ---------------------------------------------------------------------
// DESIGNERS — tbl_Designer joined with tbl_User
// ---------------------------------------------------------------------
export const SAMPLE_DESIGNERS = [
  {
    id: 1,
    designerId: 'DSG-1024',
    name: 'Ananya Rao',
    specialization: 'Modern Interior Specialist',
    experience: '8 Years',
    availability: 'Available',
    rating: 4.9,
    activeProjects: 4,
    phone: '+91 98450 11024',
    email: 'ananya.rao@idcp.com',
    photo: officeInterior
  },
  {
    id: 2,
    designerId: 'DSG-1031',
    name: 'Arjun Kumar',
    specialization: 'Luxury Design Expert',
    experience: '12 Years',
    availability: 'Busy',
    rating: 4.8,
    activeProjects: 6,
    phone: '+91 98450 11031',
    email: 'arjun.kumar@idcp.com',
    photo: modernBedroom
  },
  {
    id: 3,
    designerId: 'DSG-1047',
    name: 'Sneha Patel',
    specialization: 'Scandinavian Designer',
    experience: '6 Years',
    availability: 'Available',
    rating: 4.7,
    activeProjects: 3,
    phone: '+91 98450 11047',
    email: 'sneha.patel@idcp.com',
    photo: apartmentInterior
  },
  {
    id: 4,
    designerId: 'DSG-1052',
    name: 'Rahul Verma',
    specialization: 'Commercial Designer',
    experience: '10 Years',
    availability: 'Busy',
    rating: 4.6,
    activeProjects: 5,
    phone: '+91 98450 11052',
    email: 'rahul.verma@idcp.com',
    photo: commercialInterior
  }
]

// ---------------------------------------------------------------------
// CONTRACTORS — tbl_Contractor joined with tbl_User
// ---------------------------------------------------------------------
export const SAMPLE_CONTRACTORS = [
  {
    id: 1,
    contractorId: 'CTR-4501',
    name: 'Apex Constructions',
    contactPerson: 'Mahesh Iyer',
    specialization: 'Civil & Carpentry',
    status: 'Active',
    experience: '14 Years',
    rating: 4.8,
    phone: '+91 98230 45011',
    email: 'contact@apexconstructions.com',
    currentProject: 'Skyline Penthouse',
    photo: apartmentInterior
  },
  {
    id: 2,
    contractorId: 'CTR-4502',
    name: 'BuildWell Interiors',
    contactPerson: 'Priya Nair',
    specialization: 'Electrical & Fit-out',
    status: 'Active',
    experience: '9 Years',
    rating: 4.6,
    phone: '+91 98230 45022',
    email: 'contact@buildwellinteriors.com',
    currentProject: 'Bandra Villa Redo',
    photo: villaInterior
  },
  {
    id: 3,
    contractorId: 'CTR-4503',
    name: 'UrbanCraft Works',
    contactPerson: 'Sameer Khan',
    specialization: 'Commercial Fit-out',
    status: 'On Hold',
    experience: '11 Years',
    rating: 4.5,
    phone: '+91 98230 45033',
    email: 'contact@urbancraftworks.com',
    currentProject: 'Modern Office Interior',
    photo: officeInterior
  },
  {
    id: 4,
    contractorId: 'CTR-4504',
    name: 'Coastal Build Co.',
    contactPerson: 'Deepa Menon',
    specialization: 'Residential Construction',
    status: 'Active',
    experience: '7 Years',
    rating: 4.7,
    phone: '+91 98230 45044',
    email: 'contact@coastalbuildco.com',
    currentProject: 'Coastal Apartment',
    photo: apartmentInterior
  }
]

// ---------------------------------------------------------------------
// SUPPLIERS — tbl_Supplier joined with tbl_User
// ---------------------------------------------------------------------
export const SAMPLE_SUPPLIERS = [
  {
    id: 1,
    supplierId: 'SUP-6501',
    name: 'StoneCraft Materials',
    category: 'Marble & Natural Stone',
    contactPerson: 'Rohit Bhatia',
    rating: 4.8,
    phone: '+91 98765 65120',
    email: 'sales@stonecraft.com',
    deliveryStatus: 'On Time',
    materialsSupplied: ['Italian Marble', 'Granite', 'Quartz'],
    photo: modernBedroom
  },
  {
    id: 2,
    supplierId: 'SUP-6502',
    name: 'Woodline Interiors',
    category: 'Wood & Flooring',
    contactPerson: 'Anil Kumar',
    rating: 4.7,
    phone: '+91 98765 65121',
    email: 'sales@woodline.com',
    deliveryStatus: 'In Transit',
    materialsSupplied: ['Oak', 'Teak', 'Engineered Wood'],
    photo: modularKitchen
  },
  {
    id: 3,
    supplierId: 'SUP-6503',
    name: 'Luma Lighting Studio',
    category: 'Lighting',
    contactPerson: 'Farah Sheikh',
    rating: 4.9,
    phone: '+91 98765 65122',
    email: 'hello@lumalighting.com',
    deliveryStatus: 'Delivered',
    materialsSupplied: ['Pendant Lights', 'Chandeliers', 'LED Fixtures'],
    photo: workspaceInterior
  },
  {
    id: 4,
    supplierId: 'SUP-6504',
    name: 'TileHaus Studio',
    category: 'Tiles & Surfaces',
    contactPerson: 'Vivek Rao',
    rating: 4.6,
    phone: '+91 98765 65123',
    email: 'sales@tilehaus.com',
    deliveryStatus: 'Pending',
    materialsSupplied: ['Ceramic Tiles', 'Porcelain Tiles', 'Mosaic'],
    photo: diningRoom
  },
  {
    id: 5,
    supplierId: 'SUP-6505',
    name: 'Elegance Fabrics',
    category: 'Textiles & Drapery',
    contactPerson: 'Kiran Shah',
    rating: 4.7,
    phone: '+91 98765 65124',
    email: 'hello@elegancefab.com',
    deliveryStatus: 'On Time',
    materialsSupplied: ['Upholstery', 'Curtains', 'Cushions'],
    photo: modernBedroom
  },
  {
    id: 6,
    supplierId: 'SUP-6506',
    name: 'FinesseFittings Co.',
    category: 'Hardware & Fixtures',
    contactPerson: 'Nikhil Das',
    rating: 4.8,
    phone: '+91 98765 65125',
    email: 'sales@finessefit.com',
    deliveryStatus: 'Delivered',
    materialsSupplied: ['Brass Handles', 'Hinges', 'Locks'],
    photo: villaInterior
  }
]

// ---------------------------------------------------------------------
// MATERIALS — tbl_Material joined with tbl_MaterialCategory / tbl_Supplier
// ---------------------------------------------------------------------
export const SAMPLE_MATERIALS = [
  {
    id: 1,
    sku: 'MAT-8801',
    name: 'Italian Carrara Marble',
    category: 'Natural Stone',
    supplier: 'StoneCraft Materials',
    unitPrice: 850,
    unit: 'sq.ft',
    stock: 'In Stock',
    quantityAvailable: 1240,
    photo: modernBedroom
  },
  {
    id: 2,
    sku: 'MAT-8802',
    name: 'Natural Oak Wood',
    category: 'Wood & Flooring',
    supplier: 'Woodline Interiors',
    unitPrice: 420,
    unit: 'sq.ft',
    stock: 'In Stock',
    quantityAvailable: 680,
    photo: modularKitchen
  },
  {
    id: 3,
    sku: 'MAT-8803',
    name: 'Modern Pendant Light',
    category: 'Lighting',
    supplier: 'Luma Lighting Studio',
    unitPrice: 18500,
    unit: 'unit',
    stock: 'Low Stock',
    quantityAvailable: 12,
    photo: workspaceInterior
  },
  {
    id: 4,
    sku: 'MAT-8804',
    name: 'Terrazzo Surface Tile',
    category: 'Tiles & Surfaces',
    supplier: 'TileHaus Studio',
    unitPrice: 180,
    unit: 'sq.ft',
    stock: 'Out of Stock',
    quantityAvailable: 0,
    photo: diningRoom
  },
  {
    id: 5,
    sku: 'MAT-8805',
    name: 'Velvet Accent Sofa',
    category: 'Furniture',
    supplier: 'Elegance Fabrics',
    unitPrice: 65000,
    unit: 'unit',
    stock: 'New Arrival',
    quantityAvailable: 8,
    photo: luxuryLivingRoom
  },
  {
    id: 6,
    sku: 'MAT-8806',
    name: 'Brass Cabinet Handles',
    category: 'Hardware & Fixtures',
    supplier: 'FinesseFittings Co.',
    unitPrice: 220,
    unit: 'piece',
    stock: 'In Stock',
    quantityAvailable: 340,
    photo: villaInterior
  }
]

// ---------------------------------------------------------------------
// CUSTOMERS — tbl_Customer joined with tbl_User
// ---------------------------------------------------------------------
export const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    customerId: 'CUS-1001',
    name: 'Priya Mehta',
    email: 'priya.mehta@example.com',
    phone: '+91 98200 11001',
    address: '14 Marine Drive, Colaba',
    location: 'Mumbai',
    propertyType: 'Penthouse',
    projectType: 'Luxury Residential',
    budget: 4800000,
    startDate: '2026-06-15',
    endDate: '2026-07-28',
    requirements: 'Full penthouse renovation with a warm, luxury palette, custom joinery and a home theatre corner.',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    status: 'Active'
  },
  {
    id: 2,
    customerId: 'CUS-1002',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98200 11002',
    address: '22 Carter Road, Bandra West',
    location: 'Mumbai',
    propertyType: 'Villa',
    projectType: 'Modern Villa',
    budget: 3200000,
    startDate: '2026-07-01',
    endDate: '2026-08-18',
    requirements: 'Complete villa redo — modern minimalist interiors, open kitchen and a landscaped courtyard.',
    designer: 'Arjun Kumar',
    contractor: 'BuildWell Interiors',
    status: 'Active'
  },
  {
    id: 3,
    customerId: 'CUS-1003',
    name: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    phone: '+91 98450 11003',
    address: '5th Floor, MG Road',
    location: 'Bengaluru',
    propertyType: 'Commercial Office',
    projectType: 'Commercial',
    budget: 1850000,
    startDate: '2026-06-10',
    endDate: '2026-08-05',
    requirements: 'Modern office interior with collaborative work zones, meeting pods and branded reception.',
    designer: 'Ananya Rao',
    contractor: 'UrbanCraft Works',
    status: 'Active'
  },
  {
    id: 4,
    customerId: 'CUS-1004',
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    phone: '+91 98840 11004',
    address: '3 Marina Enclave, ECR',
    location: 'Chennai',
    propertyType: 'Apartment',
    projectType: 'Residential',
    budget: 2400000,
    startDate: '2026-05-05',
    endDate: '2026-06-20',
    requirements: 'Coastal-themed apartment interiors with light woods and breezy fabrics.',
    designer: 'Rahul Verma',
    contractor: 'Coastal Build Co.',
    status: 'Completed'
  },
  {
    id: 5,
    customerId: 'CUS-1005',
    name: 'Aditya Shah',
    email: 'aditya.shah@example.com',
    phone: '+91 98450 11005',
    address: '12 Hillview Society',
    location: 'Pune',
    propertyType: 'Residential Bungalow',
    projectType: 'Residential',
    budget: 5600000,
    startDate: '2026-06-20',
    endDate: '2026-09-30',
    requirements: 'Full bungalow interior design across four bedrooms with a dedicated study and terrace lounge.',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    status: 'Active'
  },
  {
    id: 6,
    customerId: 'CUS-1006',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 98450 11006',
    address: 'Lakeside Residency, Sector 21',
    location: 'Delhi',
    propertyType: 'Apartment',
    projectType: 'Modular Kitchen',
    budget: 2100000,
    startDate: '2026-04-01',
    endDate: '2026-06-15',
    requirements: 'Modular kitchen suite upgrade with island seating and smart storage.',
    designer: 'Arjun Kumar',
    contractor: 'BuildWell Interiors',
    status: 'Active'
  },
  {
    id: 7,
    customerId: 'CUS-1007',
    name: 'Divya Menon',
    email: 'divya.menon@example.com',
    phone: '+91 97460 55667',
    address: 'MG Road Business Park',
    location: 'Kochi',
    propertyType: 'Boutique Office',
    projectType: 'Commercial',
    budget: 1200000,
    startDate: '2026-03-05',
    endDate: '2026-09-01',
    requirements: 'Boutique studio office fit-out, currently paused pending revised budget approval.',
    designer: 'Ananya Rao',
    contractor: 'UrbanCraft Works',
    status: 'Inactive'
  },
  {
    id: 8,
    customerId: 'CUS-1008',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 98450 88990',
    address: 'Green Acres Farmhouse',
    location: 'Coimbatore',
    propertyType: 'Farmhouse',
    projectType: 'Villa',
    budget: 3600000,
    startDate: '2025-06-15',
    endDate: '2025-09-30',
    requirements: 'Farmhouse interiors with rustic wood finishes and an outdoor dining deck.',
    designer: 'Rahul Verma',
    contractor: 'Coastal Build Co.',
    status: 'Completed'
  },
  {
    id: 9,
    customerId: 'CUS-1009',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 89390 66778',
    address: '9 Skyline Towers',
    location: 'Bengaluru',
    propertyType: 'Penthouse',
    projectType: 'Residential',
    budget: 2800000,
    startDate: '2026-07-20',
    endDate: '2026-11-10',
    requirements: 'Penthouse makeover with an emphasis on natural light and a curated art wall.',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    status: 'Active'
  }
].map((customer) => ({ ...customer, photo: getImageForProjectType(customer.projectType) }))

// ---------------------------------------------------------------------
// PROJECTS — tbl_Project. One project per customer (1:1 for this demo,
// though the DB design supports 1 customer : many projects).
// currentStageIndex drives the stage-based progress UI everywhere.
// ---------------------------------------------------------------------
export const SAMPLE_PROJECTS = [
  {
    id: 1,
    projectId: 'PRJ-2601',
    customerId: 1,
    name: 'Skyline Penthouse',
    customerName: 'Priya Mehta',
    projectType: 'Luxury Residential',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    location: 'Mumbai',
    budget: 4800000,
    startDate: '2026-06-15',
    endDate: '2026-07-28',
    priority: 'High',
    currentStageIndex: 10, // Installation
    status: 'Ongoing'
  },
  {
    id: 2,
    projectId: 'PRJ-2602',
    customerId: 2,
    name: 'Bandra Villa Redo',
    customerName: 'Rahul Sharma',
    projectType: 'Villa Interior Design',
    designer: 'Arjun Kumar',
    contractor: 'BuildWell Interiors',
    location: 'Mumbai',
    budget: 3200000,
    startDate: '2026-07-01',
    endDate: '2026-08-18',
    priority: 'Medium',
    currentStageIndex: 7, // Material Selection
    status: 'Ongoing'
  },
  {
    id: 3,
    projectId: 'PRJ-2603',
    customerId: 3,
    name: 'Modern Office Interior',
    customerName: 'Meera Joshi',
    projectType: 'Office Interior Design',
    designer: 'Ananya Rao',
    contractor: 'UrbanCraft Works',
    location: 'Bengaluru',
    budget: 1850000,
    startDate: '2026-06-10',
    endDate: '2026-08-05',
    priority: 'High',
    currentStageIndex: 12, // Final Handover
    status: 'Ongoing'
  },
  {
    id: 4,
    projectId: 'PRJ-2604',
    customerId: 4,
    name: 'Coastal Apartment',
    customerName: 'Kavya Nair',
    projectType: 'Apartment Interior Design',
    designer: 'Rahul Verma',
    contractor: 'Coastal Build Co.',
    location: 'Chennai',
    budget: 2400000,
    startDate: '2026-05-05',
    endDate: '2026-06-20',
    priority: 'Medium',
    currentStageIndex: 13, // Completed
    status: 'Completed'
  },
  {
    id: 5,
    projectId: 'PRJ-2605',
    customerId: 5,
    name: 'Hillview Residence',
    customerName: 'Aditya Shah',
    projectType: 'Residential Interior Design',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    location: 'Pune',
    budget: 5600000,
    startDate: '2026-06-20',
    endDate: '2026-09-30',
    priority: 'High',
    currentStageIndex: 3, // Design
    status: 'Ongoing'
  },
  {
    id: 6,
    projectId: 'PRJ-2606',
    customerId: 6,
    name: 'Lakeside Kitchen Suite',
    customerName: 'Neha Gupta',
    projectType: 'Modular Kitchen',
    designer: 'Arjun Kumar',
    contractor: 'BuildWell Interiors',
    location: 'Delhi',
    budget: 2100000,
    startDate: '2026-04-01',
    endDate: '2026-06-15',
    priority: 'Medium',
    currentStageIndex: 8, // Procurement — behind schedule
    status: 'Delayed'
  },
  {
    id: 7,
    projectId: 'PRJ-2607',
    customerId: 7,
    name: 'Kochi Boutique Office',
    customerName: 'Divya Menon',
    projectType: 'Commercial Interior Design',
    designer: 'Ananya Rao',
    contractor: 'UrbanCraft Works',
    location: 'Kochi',
    budget: 1200000,
    startDate: '2026-03-05',
    endDate: '2026-09-01',
    priority: 'Low',
    currentStageIndex: 5, // Design Approval — paused
    status: 'On Hold'
  },
  {
    id: 8,
    projectId: 'PRJ-2608',
    customerId: 8,
    name: 'Singh Farmhouse Interiors',
    customerName: 'Vikram Singh',
    projectType: 'Villa Interior Design',
    designer: 'Rahul Verma',
    contractor: 'Coastal Build Co.',
    location: 'Coimbatore',
    budget: 3600000,
    startDate: '2025-06-15',
    endDate: '2025-09-30',
    priority: 'Medium',
    currentStageIndex: 13, // Completed
    status: 'Completed'
  },
  {
    id: 9,
    projectId: 'PRJ-2609',
    customerId: 9,
    name: 'Iyer Penthouse Makeover',
    customerName: 'Ananya Iyer',
    projectType: 'Apartment Interior Design',
    designer: 'Sneha Patel',
    contractor: 'Apex Constructions',
    location: 'Bengaluru',
    budget: 2800000,
    startDate: '2026-07-20',
    endDate: '2026-11-10',
    priority: 'Medium',
    currentStageIndex: 1, // Site Measurement
    status: 'Ongoing'
  }
].map((project) => ({
  ...project,
  image: getImageForProject(project.projectType),
  currentStage: PROJECT_STAGES[project.currentStageIndex],
  nextStage: PROJECT_STAGES[project.currentStageIndex + 1] || null,
  progress: progressPercentFromStage(project.currentStageIndex)
}))

// Snapshot used by the Dashboard's "Recent Customers" widget.
export const RECENT_CUSTOMERS = SAMPLE_CUSTOMERS.slice(0, 5).map((c) => ({
  id: c.id,
  name: c.name,
  projectType: c.projectType,
  location: c.location,
  status: c.status,
  photo: c.photo
}))

// ---------------------------------------------------------------------
// QUOTATIONS — tbl_Quotation
// ---------------------------------------------------------------------
export const SAMPLE_QUOTATIONS = [
  {
    id: 1,
    quotationId: 'QT-2026-001',
    projectId: 1,
    customerName: 'Priya Mehta',
    projectName: 'Skyline Penthouse',
    projectType: 'Luxury Residential',
    amount: 4800000,
    status: 'Approved',
    date: '2026-07-15',
    validUntil: '2026-07-30'
  },
  {
    id: 2,
    quotationId: 'QT-2026-002',
    projectId: 2,
    customerName: 'Rahul Sharma',
    projectName: 'Bandra Villa Redo',
    projectType: 'Modern Villa',
    amount: 3200000,
    status: 'Pending',
    date: '2026-07-12',
    validUntil: '2026-07-27'
  },
  {
    id: 3,
    quotationId: 'QT-2026-003',
    projectId: 3,
    customerName: 'Meera Joshi',
    projectName: 'Modern Office Interior',
    projectType: 'Commercial',
    amount: 1850000,
    status: 'Approved',
    date: '2026-07-10',
    validUntil: '2026-07-25'
  },
  {
    id: 4,
    quotationId: 'QT-2026-004',
    projectId: 4,
    customerName: 'Kavya Nair',
    projectName: 'Coastal Apartment',
    projectType: 'Residential',
    amount: 2400000,
    status: 'Rejected',
    date: '2026-07-05',
    validUntil: '2026-07-20'
  },
  {
    id: 5,
    quotationId: 'QT-2026-005',
    projectId: 5,
    customerName: 'Aditya Shah',
    projectName: 'Hillview Residence',
    projectType: 'Residential',
    amount: 5600000,
    status: 'Pending',
    date: '2026-07-18',
    validUntil: '2026-08-02'
  },
  {
    id: 6,
    quotationId: 'QT-2026-006',
    projectId: 6,
    customerName: 'Neha Gupta',
    projectName: 'Lakeside Kitchen Suite',
    projectType: 'Modular Kitchen',
    amount: 2100000,
    status: 'Approved',
    date: '2026-06-28',
    validUntil: '2026-07-13'
  }
]

// ---------------------------------------------------------------------
// PAYMENTS / INVOICES — tbl_Payment + tbl_Invoice
// ---------------------------------------------------------------------
export const SAMPLE_PAYMENTS = [
  {
    id: 1,
    invoiceId: 'INV-2026-001',
    projectId: 1,
    customerName: 'Priya Mehta',
    projectName: 'Skyline Penthouse',
    amount: 2400000,
    method: 'Bank Transfer',
    paymentDate: '2026-07-18',
    dueDate: '2026-07-15',
    status: 'Paid'
  },
  {
    id: 2,
    invoiceId: 'INV-2026-002',
    projectId: 2,
    customerName: 'Rahul Sharma',
    projectName: 'Bandra Villa Redo',
    amount: 1600000,
    method: 'UPI',
    paymentDate: null,
    dueDate: '2026-07-24',
    status: 'Pending'
  },
  {
    id: 3,
    invoiceId: 'INV-2026-003',
    projectId: 3,
    customerName: 'Meera Joshi',
    projectName: 'Modern Office Interior',
    amount: 1850000,
    method: 'Credit Card',
    paymentDate: '2026-07-15',
    dueDate: '2026-07-12',
    status: 'Paid'
  },
  {
    id: 4,
    invoiceId: 'INV-2026-004',
    projectId: 4,
    customerName: 'Kavya Nair',
    projectName: 'Coastal Apartment',
    amount: 1200000,
    method: 'Bank Transfer',
    paymentDate: '2026-06-10',
    dueDate: '2026-06-05',
    status: 'Overdue'
  },
  {
    id: 5,
    invoiceId: 'INV-2026-005',
    projectId: 5,
    customerName: 'Aditya Shah',
    projectName: 'Hillview Residence',
    amount: 2000000,
    method: 'Bank Transfer',
    paymentDate: '2026-07-02',
    dueDate: '2026-06-30',
    status: 'Paid'
  }
]

// Monthly revenue trend (in Lakhs) for the Payments/Reports charts.
export const REVENUE_TREND = [
  { month: 'Dec', value: 24 },
  { month: 'Jan', value: 27 },
  { month: 'Feb', value: 22 },
  { month: 'Mar', value: 29 },
  { month: 'Apr', value: 33 },
  { month: 'May', value: 36 },
  { month: 'Jun', value: 30 },
  { month: 'Jul', value: 34.4 }
]

export const CUSTOMER_GROWTH = [
  { month: 'Feb', value: 6 },
  { month: 'Mar', value: 9 },
  { month: 'Apr', value: 12 },
  { month: 'May', value: 15 },
  { month: 'Jun', value: 18 },
  { month: 'Jul', value: 21 }
]

export const MATERIAL_USAGE = [
  { label: 'Marble', value: 32 },
  { label: 'Wood', value: 28 },
  { label: 'Tiles', value: 18 },
  { label: 'Lighting', value: 14 },
  { label: 'Furniture', value: 24 }
]

// ---------------------------------------------------------------------
// APPOINTMENTS — tbl_Appointment
// ---------------------------------------------------------------------
export const SAMPLE_APPOINTMENTS = [
  {
    id: 1,
    projectId: 1,
    customerName: 'Priya Mehta',
    projectName: 'Skyline Penthouse',
    designer: 'Sneha Patel',
    date: '2026-07-20',
    time: '10:30 AM',
    mode: 'In Person',
    location: 'IDCP Design Studio',
    tag: 'Design Review',
    status: 'Confirmed'
  },
  {
    id: 2,
    projectId: 2,
    customerName: 'Rahul Sharma',
    projectName: 'Bandra Villa Redo',
    designer: 'Arjun Kumar',
    date: '2026-07-21',
    time: '02:00 PM',
    mode: 'Virtual Meeting',
    location: 'Virtual Meeting',
    tag: 'Material Selection',
    status: 'Confirmed'
  },
  {
    id: 3,
    projectId: 3,
    customerName: 'Meera Joshi',
    projectName: 'Modern Office Interior',
    designer: 'Ananya Rao',
    date: '2026-07-25',
    time: '11:00 AM',
    mode: 'Site Visit',
    location: 'Project Site',
    tag: 'Final Review',
    status: 'Pending'
  },
  {
    id: 4,
    projectId: 4,
    customerName: 'Kavya Nair',
    projectName: 'Coastal Apartment',
    designer: 'Rahul Verma',
    date: '2026-07-27',
    time: '03:30 PM',
    mode: 'In Person',
    location: 'IDCP Design Studio',
    tag: 'Project Discussion',
    status: 'Confirmed'
  },
  {
    id: 5,
    projectId: 5,
    customerName: 'Aditya Shah',
    projectName: 'Hillview Residence',
    designer: 'Sneha Patel',
    date: '2026-07-14',
    time: '09:30 AM',
    mode: 'Site Visit',
    location: 'Project Site',
    tag: 'Site Measurement',
    status: 'Completed'
  },
  {
    id: 6,
    projectId: 6,
    customerName: 'Neha Gupta',
    projectName: 'Lakeside Kitchen Suite',
    designer: 'Arjun Kumar',
    date: '2026-07-08',
    time: '04:00 PM',
    mode: 'Virtual Meeting',
    location: 'Virtual Meeting',
    tag: 'Procurement Update',
    status: 'Cancelled'
  }
]
