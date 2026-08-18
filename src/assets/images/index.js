// Realistic interior-design photography used across the Customer Directory.
// Each image is requested at a fixed crop/size so cards line up neatly
// regardless of the source photo's original aspect ratio.
const IMG_PARAMS = 'auto=format&fit=crop&w=800&h=480&q=80'

export const luxuryLivingRoom = `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?${IMG_PARAMS}`

// Same photo as luxuryLivingRoom above, just requested at a larger,
// portrait-friendly crop so it stays sharp when stretched across the
// full-height Login page hero panel instead of a small card thumbnail.
export const loginHeroImage = `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&h=1600&q=85`
export const modularKitchen = `https://images.unsplash.com/photo-1764526624453-db32c24eca55?${IMG_PARAMS}`
export const modernBedroom = `https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?${IMG_PARAMS}`
export const officeInterior = `https://images.unsplash.com/photo-1706074793638-da28b90ea8ae?${IMG_PARAMS}`
export const villaInterior = `https://images.unsplash.com/photo-1505843694770-3461f546bd8f?${IMG_PARAMS}`
export const apartmentInterior = `https://images.unsplash.com/photo-1613575831056-0acd5da8f085?${IMG_PARAMS}`
export const diningRoom = `https://images.unsplash.com/photo-1616486701797-0f33f61038ec?${IMG_PARAMS}`
export const workspaceInterior = `https://images.unsplash.com/photo-1752223638233-4c9545333f89?${IMG_PARAMS}`

// Additional interior photography used on the Projects page — same
// Unsplash source and crop parameters as the Customers page images above,
// so every photo across the app shares one consistent visual style.
export const modularKitchenAlt = `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?${IMG_PARAMS}`
export const apartmentInteriorAlt = `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${IMG_PARAMS}`
export const commercialInterior = `https://images.unsplash.com/photo-1497366216548-37526070297c?${IMG_PARAMS}`
export const livingRoomAlt = `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?${IMG_PARAMS}`

// Maps each sample project type used in Customers.jsx to a specific photo.
// Kept as an explicit lookup (rather than fuzzy matching) so every customer
// card always renders a deliberate, on-brand image.
export const projectTypeImages = {
  'Luxury Residential': luxuryLivingRoom,
  'Modern Villa': villaInterior,
  'Commercial': officeInterior,
  'Residential': apartmentInterior,
  'Studio Apartment': apartmentInterior,
  'Boutique Office': workspaceInterior,
  'Farmhouse': diningRoom,
  'Penthouse': modularKitchen
}

// Fallback used for any project type not present in the map above
// (e.g. a brand-new customer added through the "Add Customer" form).
export const defaultProjectImage = luxuryLivingRoom

export function getImageForProjectType(projectType) {
  return projectTypeImages[projectType] || defaultProjectImage
}

// Maps the Projects page's project types to a photo, reusing the same
// image set/style as the Customers directory above.
export const projectListImages = {
  'Residential Interior Design': apartmentInteriorAlt,
  'Villa Interior Design': villaInterior,
  'Office Interior Design': officeInterior,
  'Modular Kitchen': modularKitchenAlt,
  'Apartment Interior Design': apartmentInterior,
  'Commercial Interior Design': commercialInterior
}

export function getImageForProject(projectType) {
  return projectListImages[projectType] || defaultProjectImage
}
