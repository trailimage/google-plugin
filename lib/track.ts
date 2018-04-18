import { TrackFeatures, geoJSON } from '@toba/map';
import { is } from '@toba/tools';
import { photoBlog } from '@trailimage/models';
import { client } from './provider';

/**
 * Get GeoJSON for single post. If post has no track then return empty GPX.
 */
export async function loadTrack(postKey: string): Promise<TrackFeatures> {
   const post = photoBlog.postWithKey(postKey);

   if (!is.value(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   let geo: TrackFeatures;
   const noGPX = geoJSON.features();

   if (post.triedTrack && !post.hasTrack) {
      geo = noGPX;
   } else {
      geo = await client
         .readFileWithName(post.title + '.gpx')
         .then(geoJSON.featuresFromGPX)
         .catch(() => noGPX);
   }
   return geo;
}
