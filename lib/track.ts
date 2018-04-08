import { is } from '@toba/tools';
import { photoBlog } from '@trailimage/models';
import { geoJSON } from '@toba/map';
import { client } from './provider';

/**
 * Get GeoJSON for single post. If post has no track then return empty GPX.
 */
export async function loadTrack(postKey: string) {
   const post = photoBlog.postWithKey(postKey);

   if (!is.value(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   let geo: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;
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
