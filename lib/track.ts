import { TrackFeatures, geoJSON } from '@toba/map';
import { is } from '@toba/tools';
import { blog, Post } from '@trailimage/models';
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

   const noGPX = geoJSON.features<LineString>();

   return post.triedTrack && !post.hasTrack
      ? noGPX
      : await getGPX(post)
           .then(geoJSON.featuresFromGPX)
           .catch(() => noGPX);
}

const getGPX = (post: Post) =>
   googleDrive.client.readFileWithName(post.title + '.gpx');

/**
 * Stream track GPX for single post. If post has no track then end the stream.
 *
 * @param postKey Usually the URL slug (not post provider ID)
 * @param stream Writable stream, usually an HTTP response for file download
 */
export function streamGPX(postKey: string, stream: Writable): Promise<void> {
   const post = blog.postWithKey(postKey);

   if (!is.value(post)) {
      return Promise.reject(`Post ${postKey} not found`);
   }

   if (post.triedTrack && !post.hasTrack) {
      return Promise.reject(`Post ${postKey} has no track`);
   } else {
      return getGPX(post).then(gpx => stream.end(gpx));
   }
}
