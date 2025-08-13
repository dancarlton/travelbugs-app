import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'

export function useLocationLive() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(
    null
  )
  const [permissionDenied, setPermissionDenied] = useState(false)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setPermissionDenied(true)
        return
      }
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        loc => setCoords(loc.coords)
      )
    })()
    return () => watchRef.current?.remove()
  }, [])

  return { coords, permissionDenied }
}
