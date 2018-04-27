import { GoogleDriveClient, GoogleConfig } from '@toba/google-drive';

let _client: GoogleDriveClient = null;
let _config: GoogleConfig = null;

/**
 * Apply configuration used to connect with Google Drive.
 */
export function configure(config: GoogleConfig) {
   _config = config;
}

export const googleDrive = {
   get client() {
      if (_client == null) {
         if (_config === null) {
            throw new Error('Invalid Google API client configuration');
         }
         _client = new GoogleDriveClient(_config);
      }
      return _client;
   },

   get config() {
      return _config;
   },

   configure(config: GoogleConfig) {
      _config = config;
   }
};
