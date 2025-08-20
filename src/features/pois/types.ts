export type Poi = {
  id: string;
  name: string;
  category: string | null;
  latitude: number;
  longitude: number;
  city: string | null;
  neighborhood: string | null;
  image_url: string | null;
}

export type PoiPreview = {
  id: string
  name: string
  lat: number
  lng: number
  imageUrl?: string
  neighborhood?: string
  category?: string
  distanceMeters?: number
}
