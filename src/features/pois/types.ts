export type LngLat = [number, number]

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
