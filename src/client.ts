import { is } from '@toba/node-tools';
import { GoogleDriveClient } from '@toba/google-drive';
import { provider } from './provider';

let _client: GoogleDriveClient | null = null;

export const googleDrive = {
   get client() {
      if (_client == null) {
         if (!is.value(provider.config) || !is.value(provider.config.api)) {
            throw new Error('Invalid Google API client configuration');
         }
         _client = new GoogleDriveClient(provider.config.api);
      }
      return _client;
   },

   get config() {
      return provider.config.api;
   }
};
