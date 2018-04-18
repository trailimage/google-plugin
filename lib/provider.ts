import { GoogleDriveClient } from '@toba/google-drive';
import { MapProvider } from '@trailimage/models';
import { loadTrack } from './track';

export const provider: MapProvider = { track: loadTrack };

export const client: GoogleDriveClient = new GoogleDriveClient(null);
