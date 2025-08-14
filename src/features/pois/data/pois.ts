import { Poi } from '../types'

export const POIS: Poi[] = [
    {
    id: 'test-library-1',
    name: 'My Test Library',
    coordinates: [-117.820747, 33.660671], // [lng, lat] <-- replace with actual coords
    category: 'library',
  },
  {
    id: 'poi-laguna-beach-1',
    name: 'Greeters Corner',
    coordinates: [-117.7836, 33.5426],
    category: 'landmark',
  },
  {
    id: 'poi-irvine-1',
    name: 'Irvine Spectrum Giant Wheel',
    coordinates: [-117.7441, 33.6526],
    category: 'landmark',
  },
  {
    id: 'poi-newport-1',
    name: 'Balboa Pier',
    coordinates: [-117.9009, 33.6034],
    category: 'view',
  },
]
