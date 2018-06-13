import { is } from '@toba/tools';
import { GoogleDriveClient } from '@toba/google-drive';
import { config } from './index';

let _client: GoogleDriveClient = null;

export const googleDrive = {
   get client() {
      if (_client == null) {
         if (!is.value(config.api)) {
            throw new Error('Invalid Google API client configuration');
         }
         _client = new GoogleDriveClient(config.api);
      }
      return _client;
   },

   get config() {
      return config.api;
   }
};
