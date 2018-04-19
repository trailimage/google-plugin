import { MapProvider } from '@trailimage/models';
import { loadTrack } from './track';

export const provider: MapProvider = { track: loadTrack };
