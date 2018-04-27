import { geoJSON } from '@toba/map';
import { config as modelConfig } from '@trailimage/models';
import '@toba/test';
import { Feature, LineString } from 'geojson';
import { postWithGPX, postWithoutGPX, testConfig } from './.test-data';
import { mapProvider, mapConfigure } from '../';

beforeAll(() => {
   mapConfigure(testConfig);
   modelConfig.providers.map = mapProvider;
});

test('Loads file and converts to GPX', async () => {
   const track = await postWithGPX.geoJSON();

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
   const track = await postWithoutGPX.geoJSON();
   expect(track).toBeDefined();
   expect(track).toEqual(geoJSON.features());
});
