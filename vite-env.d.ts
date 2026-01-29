import type React from 'react';

import { type EvarsSchema } from './evars/evars-client.config';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

declare module '*.css';
declare module '*.svg' {
  const content: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module 'vite-plugin-svgr/client' {}
declare module 'vite/client' {
  type ImportMetaEnvironment = EvarsSchema & {};
}
