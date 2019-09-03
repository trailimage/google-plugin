import '@toba/test';
import { MemoryStream } from '@toba/test';
import { TrackFeatures, geoJSON } from '@toba/map';
import { Feature, LineString } from 'geojson';
import { postWithGPX, postWithoutGPX } from './.test-data';
import { loadTrack, streamGPX } from './track';
import { provider } from './provider';

/**
 * Used to skip tests that require live API configuration.
 */
const isConfigured = provider.config.api.apiKey !== undefined;

if (isConfigured) {
   test('loads file and converts to GeoJSON', async () => {
      const track = await loadTrack(postWithGPX.key);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('features');
      expect(track.features).toBeInstanceOf(Array);

      const feature = track.features[0] as Feature<LineString>;
      const line: LineString = feature.geometry;

      expect(feature.type).toBe('Feature');
      expect(line.type).toBe('LineString');
      expect(line.coordinates.length).toBe(555);
   });

   test('streams GPX file', async () => {
      const stream = new MemoryStream();
      await streamGPX(postWithGPX.key, stream);
      expect(stream.writeWasCalled).toBe(true);
      expect(stream.receivedData).toBe(true);
      expect(stream.text.includes('<?xml')).toBe(true);
   });

   test('throws error for non-existent GPX file', async () => {
      let e: Error | undefined = undefined;
      const stream = new MemoryStream();

      try {
         await streamGPX(postWithoutGPX.key, stream);
      } catch (err) {
         e = err;
      }
      expect(stream.writeWasCalled).toBe(false);
      // error here is just a message not an object
      expect(e).toBe(`File not found: “${postWithoutGPX.title}.gpx”`);
   });
}

test('returns empty GeoJSON for posts without track', async () => {
   const track = await loadTrack(postWithoutGPX.key);
   expect(track).toBeDefined();
   expect(track).toEqual(geoJSON.features());
});

test('throws error for non-existent key', async () => {
   let t: TrackFeatures | undefined = undefined;
   let e: Error | undefined = undefined;
   const fakeKey = 'not-a-key';

   try {
      t = await loadTrack(fakeKey);
   } catch (err) {
      e = err;
   }
   expect(t).toBeUndefined();
   expect(e).toBeDefined();
   expect(e!.message).toBe(`Post ${fakeKey} not found`);
});
