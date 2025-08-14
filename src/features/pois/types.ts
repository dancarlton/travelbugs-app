export type LngLat = [number, number]

export type Poi = {
  id: string
  name: string
//   description: string
  coordinates: [number, number] // [lng, lat]
  category: string
}
