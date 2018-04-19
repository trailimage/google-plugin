import { GoogleDriveClient } from '@toba/google-drive';
import '@toba/test';
import { googleDrive } from './client';
import { testConfig } from './.test-data';

test('Throws exception for invalid configuration', () => {
   let e: Error;
   let c: GoogleDriveClient;

   googleDrive.configure(null);

   try {
      c = googleDrive.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeUndefined();
   expect(e).toBeDefined();
   expect(e.message).toBe('Invalid Google API client configuration');
});

test('Allows configuration', () => {
   let e: Error;
   let c: GoogleDriveClient;

   googleDrive.configure(testConfig);

   try {
      c = googleDrive.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeDefined();
   expect(e).toBeUndefined();
});
