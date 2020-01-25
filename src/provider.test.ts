import '@toba/test'
import { GeoJSON } from '@toba/map'
import { config as modelConfig } from '@trailimage/models'
import { Feature, LineString } from 'geojson'
import { postWithGPX, postWithoutGPX } from './.test-data'
import { provider } from './provider'

beforeAll(() => {
   modelConfig.providers.map = provider
})

test('retrieves track for post', async () => {
   const track = await postWithGPX.geoJSON()
   expect(track).toBeDefined()
   expect(track).toHaveProperty('features')
   expect(track.features).toBeInstanceOf(Array)

   const feature = track.features[0] as Feature<LineString>
   expect(feature).toBeDefined()
   expect(feature.type).toBe('Feature')

   const line: LineString = feature.geometry
   expect(line.type).toBe('LineString')
   expect(line.coordinates.length).toBe(555)
})

test('returns empty GeoJSON for posts without track', async () => {
   const track = await postWithoutGPX.geoJSON()
   expect(track).toBeDefined()
   expect(track).toEqual(GeoJSON.features())
})
