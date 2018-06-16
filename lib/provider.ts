import { MapProvider } from '@trailimage/models';
import { GoogleConfig } from '@toba/google-drive';
import { loadTrack } from './track';

export interface ProviderConfig {
   api: GoogleConfig;
}

class GoogleProvider extends MapProvider<ProviderConfig> {
   track = (postKey: string) => loadTrack(postKey);
}

export const provider = new GoogleProvider({ api: null });
