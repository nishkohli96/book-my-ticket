/**
 * Only client-safe constants belong in this barrel. `environment.ts`
 * calls `defEnvVariable` on secrets at module-load time - importing it
 * from a client component throws, since those vars are never inlined
 * into the browser bundle. Server code must import it directly
 * (`@/constants/environment`), never add it here.
 */

export * from './params';
