import { TrackFeatures, geoJSON } from '@toba/map';
import { is } from '@toba/node-tools';
import { blog, Post } from '@trailimage/models';
import { googleDrive } from './client';
import { LineString } from 'geojson';
import { Writable } from 'stream';

/**
 * Get GeoJSON for single post. If post has no track then return empty object.
 *
 * @param postKey Usually the URL slug (not post provider ID)
 */
export async function loadTrack(postKey?: string): Promise<TrackFeatures> {
   if (postKey === undefined) {
      throw new ReferenceError('Post key not provided for loading track');
   }
   const post = blog.postWithKey(postKey);

   if (!is.value<Post>(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   const noGPX = geoJSON.features<LineString>();

   return post.triedTrack && !post.hasTrack
      ? noGPX
      : await getGPX(post)
           .then(gpxText => {
              if (gpxText === null) {
                 return noGPX;
              }
              const features = geoJSON.featuresFromGPX(gpxText);
              return features !== null ? features : noGPX;
           })
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
export async function streamGPX(postKey?: string, stream?: Writable) {
   if (postKey === undefined || stream === undefined) {
      throw new ReferenceError('Post key not provided for streaming track');
   }
   const post = blog.postWithKey(postKey);

   if (!is.value<Post>(post)) {
      throw new ReferenceError(`Post ${postKey} not found`);
   }

   if (post.triedTrack && !post.hasTrack) {
      throw new ReferenceError(`Post ${postKey} has no track`);
   } else {
      return getGPX(post).then(gpx => stream.end(gpx));
   }
}
