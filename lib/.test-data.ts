import { env } from '@toba/tools';
import { Config as AuthConfig } from '@toba/oauth';
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
         clientID: env('GOOGLE_CLIENT_ID'),
         secret: env('GOOGLE_SECRET'),
         callback: 'http://localhost/auth/google',
         token: {
            type: null,
            access: env('GOOGLE_ACCESS_TOKEN', null),
            accessExpiration: null as Date,
            refresh: env('GOOGLE_REFRESH_TOKEN')
         }
      } as AuthConfig
   }
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
