/**
 * Bootstrap for the standalone bundle — must run before any component mounts.
 *
 * Registering ESSE schemas and the application registry driver is the host application's job, not
 * the library's, so it lives here (in the bundle's own entry point) and not in anything reachable
 * from `exports.ts`. Consumers of `@mat3ra/wove` (web-app, workflow-designer) do it at startup.
 *
 * Imported for its side effects only; keep it first in `index.tsx`.
 */
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import { ApplicationRegistry } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";

// 1. Register all ESSE schemas so `JSONSchemasInterface` lookups (and wode entity construction,
//    which validates against them) work.
JSONSchemasInterface.setSchemas(esseSchemas as any);
// 2. Set the driver so `getExecutablesByApplication()` and friends resolve.
ApplicationRegistry.setDriver(new StandataDriver());
