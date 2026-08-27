import type { JobSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import Workflow from "@mat3ra/wode/dist/js/Workflow";

/**
 * Workflow JSON handed in from outside: `workflow.to_json()` in a Jupyter notebook, an API
 * response, a file on disk. The shapes are ESSE's — a `workflow` config, or a payload carrying
 * one under `workflow` (a `job` config) — as the object itself or as a JSON string of it.
 */
export type WorkflowConfigInput = WorkflowSchema | JobSchema | string;

/** `true` for a payload that carries the workflow one level down, e.g. an ESSE `job` config. */
function isWorkflowContainer(config: object): config is JobSchema {
    const { workflow } = config as Partial<JobSchema>;
    return Boolean(workflow) && typeof workflow === "object" && !Array.isArray(workflow);
}

/**
 * Normalize whatever came in from outside into an ESSE workflow config: parse a JSON string, take
 * the `toJSON()` of an entity the host app already holds, and unwrap the `workflow` of a job-like
 * payload so callers can pass either one.
 */
export function parseWorkflowConfig(input: WorkflowConfigInput | Workflow): WorkflowSchema {
    const parsed: unknown = typeof input === "string" ? JSON.parse(input) : input;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new TypeError("wove: workflow config must be an object or a JSON string of one");
    }
    // An entity (this wode's `Workflow`, or a host app's own copy of it) hands back its config.
    const config: object =
        "toJSON" in parsed && typeof parsed.toJSON === "function" ? parsed.toJSON() : parsed;
    // Take the nested workflow when there is nothing to show at this level.
    if (!("units" in config) && isWorkflowContainer(config)) {
        return config.workflow as WorkflowSchema;
    }
    return config as WorkflowSchema;
}

/**
 * Config for the wode `Workflow` constructor: a clone (the entity holds on to, and mutates, what it
 * is handed) with the entity lists defaulted. `units`, `subworkflows` and `workflows` are
 * *required* by the schema, yet workflow JSON from outside routinely omits the empty ones —
 * `Subworkflow.toJSON()`-derived payloads and hand-written configs both do.
 */
function toEntityConfig(config: WorkflowSchema): ConstructorParameters<typeof Workflow>[0] {
    const clone = JSON.parse(JSON.stringify(config)) as WorkflowSchema;
    // The cast is the boundary between the ESSE document type and the entity's own: ESSE types the
    // recursive `workflows` as `{}[]`, wode narrows it to `WorkflowSchema[]`. Past here the config
    // is the entity's business to validate.
    return {
        ...clone,
        units: clone.units ?? [],
        subworkflows: clone.subworkflows ?? [],
        workflows: clone.workflows ?? [],
    } as unknown as ConstructorParameters<typeof Workflow>[0];
}

/**
 * Entity errors report a code (`REQUIRED_PROPERTY_MISSING`) and carry the ESSE schema that did the
 * rejecting. Fold both into one line, so a caller looking at their own JSON can see what it needs.
 */
function describeEntityError(error: unknown): string {
    const { code, details } = (error ?? {}) as {
        code?: string;
        details?: { schema?: { title?: string; required?: string[] } };
    };
    const { title, required } = details?.schema ?? {};
    const what = title ?? "it";
    const requires = required?.length ? ` — ${what} requires: ${required.join(", ")}` : "";
    return `${code ?? (error instanceof Error ? error.message : String(error))}${requires}`;
}

/**
 * Build the wode `Workflow` the viewer components consume from JSON passed in from outside.
 *
 * The entity is what gives the cards their subworkflows, model instances, properties and statuses,
 * and it validates the config against the ESSE schemas on the way in. A config it rejects — one
 * that is not valid ESSE — throws here; {@link WorkflowViewer} catches that and says so rather
 * than rendering a half-populated view of JSON nobody can vouch for.
 */
export function createWorkflowFromConfig(input: WorkflowConfigInput | Workflow): Workflow {
    if (input instanceof Workflow) return input;
    const config = toEntityConfig(parseWorkflowConfig(input));
    try {
        return new Workflow(config);
    } catch (error) {
        throw new Error(`wove: not a valid workflow config: ${describeEntityError(error)}`, {
            cause: error,
        });
    }
}
