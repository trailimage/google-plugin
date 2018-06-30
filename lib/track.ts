import { TrackFeatures, geoJSON } from '@toba/map';
import { is } from '@toba/tools';
import { blog } from '@trailimage/models';
import { googleDrive } from './client';
import { LineString } from 'geojson';
import { Writable } from 'stream';

/**
 * Get GeoJSON for single post. If post has no track then return empty object.
 *
 * @param postKey Usually the URL slug (not post provider ID)
 */
export async function loadTrack(postKey: string): Promise<TrackFeatures> {
   const post = blog.postWithKey(postKey);

   if (!is.value(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   let geo: TrackFeatures;
   const noGPX = geoJSON.features<LineString>();

   if (post.triedTrack && !post.hasTrack) {
      geo = noGPX;
   } else {
      geo = await googleDrive.client
         .readFileWithName(post.title + '.gpx')
         .then(geoJSON.featuresFromGPX)
         .catch(() => noGPX);
   }
   return geo;
}

/**
 * Stream track GPX for single post. If post has no track then end the stream.
 *
 * @param postKey Usually the URL slug (not post provider ID)
 * @param stream Writable stream, usually an HTTP response for file download
 */
export function streamGPX(postKey: string, stream: Writable): Promise<void> {
   const post = blog.postWithKey(postKey);

   if (!is.value(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   if (post.triedTrack && !post.hasTrack) {
      stream.end();
      return Promise.resolve();
   } else {
      return googleDrive.client.readFileWithName(post.title + '.gpx', stream);
   }
}
