import { DefineSetupStoreOptions } from 'pinia';

declare module 'pinia' {
  export interface DefineSetupStoreOptions<State> {
    persist?: {
      storage: {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
      };
    };
  }
}