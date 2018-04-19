import { TrackFeatures, geoJSON } from '@toba/map';
import '@toba/test';
import { Feature, LineString } from 'geojson';
import { postWithGPX, postWithoutGPX, testConfig } from './.test-data';
import { googleDrive } from './client';
import { loadTrack } from './track';

beforeAll(() => {
   googleDrive.configure(testConfig);
});

test('Loads file and converts to GPX', async () => {
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

test('Returns empty GPX for posts without track', async () => {
   const track = await loadTrack(postWithoutGPX.key);
   expect(track).toBeDefined();
   expect(track).toEqual(geoJSON.features());
});

test('Throws error for non-existent key', async () => {
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
