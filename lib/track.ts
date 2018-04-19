import { TrackFeatures, geoJSON } from '@toba/map';
import { is } from '@toba/tools';
import { blog } from '@trailimage/models';
import { googleDrive } from './client';

/**
 * Get GeoJSON for single post. If post has no track then return empty object.
 */
export async function loadTrack(postKey: string): Promise<TrackFeatures> {
   const post = blog.postWithKey(postKey);

   if (!is.value(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   let geo: TrackFeatures;
   const noGPX = geoJSON.features();

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
