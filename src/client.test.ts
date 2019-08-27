import '@toba/test';
import { GoogleDriveClient } from '@toba/google-drive';
import { googleDrive } from './client';

test('throws exception for invalid configuration', () => {
   let e: Error | undefined = undefined;
   let c: GoogleDriveClient | undefined = undefined;

   try {
      c = googleDrive.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeUndefined();
   expect(e).toBeDefined();
   expect(e!.message).toBe('Invalid Google API client configuration');
});

test('allows configuration', async () => {
   let e: Error | undefined = undefined;
   let c: GoogleDriveClient | undefined = undefined;

   await import('./.test-data');

   try {
      c = googleDrive.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeDefined();
   expect(e).toBeUndefined();
});
