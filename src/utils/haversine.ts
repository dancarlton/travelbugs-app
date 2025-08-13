export function distanceMeters(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) {
  const R = 6371000
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function metersToFeet(m: number) {
  return m * 3.28084
}

export function formatFeet(meters: number) {
  const ft = metersToFeet(meters)
  const rounded = Math.max(0, Math.round(ft / 10) * 10) // nearest 10 ft
  return `${rounded.toLocaleString()} ft`
}
