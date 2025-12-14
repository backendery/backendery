/* eslint-disable canonical/filename-match-regex */
import { type SVGProps } from 'react';

import { type EvarsSchema } from './evars-schema.config';

declare module '*.svg?react' {
  const ReactComponent: React.FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module 'vite-plugin-svgr/client' {}
declare module 'vite/client' {
  type ImportMetaEnvironment = EvarsSchema & {};
}
