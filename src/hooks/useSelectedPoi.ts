import { useState, useCallback } from 'react'
import type { Poi } from '../types'

export function useSelectedPoi() {
  const [selected, setSelected] = useState<Poi | null>(null)
  const select = useCallback((poi: Poi | null) => setSelected(poi), [])
  return { selected, select }
}
