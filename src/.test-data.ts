import { env } from '@toba/node-tools';
import { AuthConfig } from '@toba/oauth';
import { Post, blog } from '@trailimage/models';
import { provider } from './provider';

/**
 * @see http://code.google.com/apis/console/#project:1033232213688
 */
provider.configure({
   api: {
      apiKey: env('GOOGLE_DRIVE_KEY'),
      folderID: '0B0lgcM9JCuSbMWluNjE4LVJtZWM',
      useCache: false,
      cacheSize: 0,
      auth: {
         apiKey: '',
         clientID: env('GOOGLE_CLIENT_ID'),
         secret: env('GOOGLE_SECRET'),
         callback: 'http://localhost/auth/google',
         token: {
            type: '',
            access: env('GOOGLE_ACCESS_TOKEN', undefined),
            accessExpiration: undefined,
            refresh: env('GOOGLE_REFRESH_TOKEN')
         }
      } as AuthConfig
   },
   maxMarkers: 10
});

export const postWithGPX = new Post();
export const postWithoutGPX = new Post();

postWithGPX.title = 'With Nick and Kayla on Mores Mountain';
postWithGPX.key = 'with-gpx';
postWithGPX.id = '1';

postWithoutGPX.title = 'Any title';
postWithoutGPX.key = 'without-gpx';
postWithGPX.id = '2';

blog.addAll(postWithGPX, postWithoutGPX);
