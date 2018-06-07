import '@toba/test';
import { TrackFeatures, geoJSON } from '@toba/map';
import { Feature, LineString } from 'geojson';
import { postWithGPX, postWithoutGPX } from './.test-data';
import { loadTrack } from './track';

test('loads file and converts to GPX', async () => {
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

test('returns empty GPX for posts without track', async () => {
   const track = await loadTrack(postWithoutGPX.key);
   expect(track).toBeDefined();
   expect(track).toEqual(geoJSON.features());
});

test('throws error for non-existent key', async () => {
   let t: TrackFeatures;
   let e: Error;
   const fakeKey = 'not-a-key';

   try {
      t = await loadTrack(fakeKey);
   } catch (err) {
      e = err;
   }
   expect(t).toBeUndefined();
   expect(e).toBeDefined();
   expect(e.message).toBe(`Post ${fakeKey} not found`);
});
