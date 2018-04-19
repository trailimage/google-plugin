import '@toba/test';
import { TrackFeatures, geoJSON } from '@toba/map';
import { testConfig, postWithGPX, postWithoutGPX } from './.test-data';
import { loadTrack } from './track';
import { googleDrive } from './client';

beforeAll(() => {
   googleDrive.configure(testConfig);
});

test('Loads file and converts to GPX', async () => {
   const track = await loadTrack(postWithGPX.key);
   expect(track).toBeDefined();
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
