import * as Location from 'expo-location'
import { useEffect, useMemo, useState } from 'react'

/** Optional: shorten state names like "California" -> "CA" */
function abbr(region?: string) {
  if (!region) return undefined
  const map: Record<string, string> = {
    California: 'CA' /* add more if you want */,
  }
  return map[region] ?? region
}

export function useCityFromLocation(
  coords: { latitude: number; longitude: number } | null
) {
  const [city, setCity] = useState<string | null>(null)
  const [region, setRegion] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Debounce reverse geocode a bit so we don't spam it as GPS moves
  useEffect(() => {
    if (!coords) return
    let cancelled = false
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        const results = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
        if (!cancelled && results[0]) {
          const r = results[0]
          setCity(r.city ?? r.subregion ?? r.district ?? null)
          setRegion(
            abbr(r.region ?? r.subregion ?? r.administrativeArea) ?? null
          )
          setCountry(r.isoCountryCode ?? r.country ?? null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [coords?.latitude, coords?.longitude])

  const label = useMemo(() => {
    if (!city && !region && !country) return null
    // Example: "Irvine, CA" or fallback to country if region missing
    if (city && region) return `${city}, ${region}`
    if (city && country) return `${city}, ${country}`
    return city ?? region ?? country ?? null
  }, [city, region, country])

  return { city, region, country, label, loading }
}
