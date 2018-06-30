import { MapProvider } from '@trailimage/models';
import { MapConfig } from '@toba/map';
import { unlist } from '@toba/tools';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { GoogleConfig } from '@toba/google-drive';
import { loadTrack, streamGPX } from './track';
import { googleDrive } from './client';
import { Writable } from 'stream';

export interface ProviderConfig extends MapConfig {
   api: GoogleConfig;
}

class GoogleProvider extends MapProvider<ProviderConfig> {
   track(postKey: string) {
      return loadTrack(postKey);
   }

   gpx(postKey: string, stream: Writable) {
      return streamGPX(postKey, stream);
   }

   authorizationURL() {
      return Promise.resolve(googleDrive.client.authorizationURL);
   }

   async getAccessToken(req: IncomingMessage) {
      const url = parse(req.url, true);
      const code = unlist(url.query['code'], true);
      return googleDrive.client.getAccessToken(code);
   }
}

/**
 * Google Provider singleton.
 */
export const provider = new GoogleProvider();
