import { GoogleConfig } from '@toba/google-drive';

export interface ProviderConfig {
   api: GoogleConfig;
}

export const config: ProviderConfig = {
   api: null
};
