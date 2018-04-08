import { MapProvider } from '@trailimage/models';
import { GoogleDriveClient } from '@toba/google-drive';

export const provider: MapProvider = {};

export const client: GoogleDriveClient = new GoogleDriveClient(null);
