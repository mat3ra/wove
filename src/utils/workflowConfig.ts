import type { SubworkflowSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import Workflow from "@mat3ra/wode/dist/js/Workflow";

/**
 * Workflow JSON handed in from outside the app: `workflow.to_json()` in a Jupyter notebook, an
 * API response, a file on disk. Either the `workflow` ESSE config itself, a JSON string of one,
 * or a payload carrying one under `workflow` (a job config, for instance).
 */
export type WorkflowConfigInput = WorkflowSchema | Record<string, any> | string;

/**
 * The slice of a wode `Workflow` the viewer components read. Anything exposing `unitInstances` +
 * `subworkflowInstances` renders: a real `Workflow` (the normal case), a workflow instance the
 * host app already holds, or the plain-JSON stand-in below.
 */
export interface WorkflowLike {
    name?: string;
    unitInstances: any[];
    subworkflowInstances: any[];
    toJSON?: () => Record<string, any>;
}

/** `true` when the value already exposes the instances the viewer needs (e.g. a wode `Workflow`). */
export function isWorkflowLike(value: unknown): value is WorkflowLike {
    const candidate = value as WorkflowLike | null;
    return Boolean(
        candidate &&
        typeof candidate === "object" &&
        Array.isArray(candidate.unitInstances) &&
        Array.isArray(candidate.subworkflowInstances),
    );
}

/**
 * Normalize whatever came in from outside into a workflow config object: parse a JSON string,
 * and unwrap the `workflow` of a job-like payload so callers can pass either one.
 */
export function parseWorkflowConfig(input: WorkflowConfigInput): Record<string, any> {
    const parsed: unknown = typeof input === "string" ? JSON.parse(input) : input;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new TypeError("wove: workflow config must be an object or a JSON string of one");
    }
    const config = parsed as Record<string, any>;
    // Job-like payloads keep the workflow one level down; take it when there is nothing to show here.
    const { workflow } = config;
    if (!config.units && workflow && typeof workflow === "object" && !Array.isArray(workflow)) {
        return workflow as Record<string, any>;
    }
    return config;
}

/** Entity list off a config, tolerating the key being absent or not a list. */
function configList(config: Record<string, any>, key: string): Record<string, any>[] {
    const value = config[key];
    return Array.isArray(value) ? value : [];
}

/** Unit JSON as a minimal unit instance: `id` for subworkflow lookup, `toJSON()` for flowcharts. */
function adaptUnitConfig(unit: Record<string, any>) {
    return {
        status: "idle",
        ...unit,
        id: unit._id ?? unit.id,
        toJSON: () => unit,
    };
}

/**
 * Plain-JSON stand-in for a wode `Subworkflow` — enough of the interface for the unit cards, the
 * overview accordion and `Properties` to render read-only, with no schema validation involved.
 */
export function adaptSubworkflowConfig(config: SubworkflowSchema | Record<string, any>) {
    const json = config as Record<string, any>;
    const model = (json.model ?? {}) as Record<string, any>;
    return {
        _json: json,
        id: json._id,
        name: json.name ?? "Subworkflow",
        application: json.application ?? {},
        model,
        method: json.method ?? {},
        properties: json.properties ?? [],
        isDraft: Boolean(json.isDraft),
        setIsDraft: (isDraft: boolean) => {
            json.isDraft = isDraft;
        },
        // `OverviewAccordion` reads `modelInstance.isUnknown`; `prop()`/`toJSON()` keep an injected
        // ModelComponent (e.g. @mat3ra/move's) from throwing on a model it cannot resolve.
        modelInstance: {
            ...model,
            isUnknown: !model.type,
            prop: (_key: string) => undefined,
            toJSON: () => model,
        },
        unitsInstances: configList(json, "units").map(adaptUnitConfig),
        toJSON: () => json,
    };
}

/** Plain-JSON stand-in for a wode `Workflow`; see {@link createWorkflowFromConfig}. */
export function adaptWorkflowConfig(config: Record<string, any>): WorkflowLike {
    return {
        name: config.name,
        unitInstances: configList(config, "units").map(adaptUnitConfig),
        subworkflowInstances: configList(config, "subworkflows").map(adaptSubworkflowConfig),
        toJSON: () => config,
    };
}

/**
 * Config for the wode `Workflow` constructor: a clone (the entity holds on to, and mutates, what it
 * is handed) with the entity lists it cannot do without. `workflows` is a *required* prop and the
 * other two are mapped in the constructor, yet workflow JSON from outside routinely omits all
 * three — `Subworkflow.toJSON()`-derived payloads and hand-written configs both do.
 */
function toEntityConfig(config: Record<string, any>): ConstructorParameters<typeof Workflow>[0] {
    const clone: Record<string, any> = JSON.parse(JSON.stringify(config));
    ["units", "subworkflows", "workflows"].forEach((key) => {
        clone[key] = configList(clone, key);
    });
    // The cast is the boundary: past here the config is the entity's business to validate, and a
    // config it rejects lands in the fallback below rather than as a type error at the call site.
    return clone as ConstructorParameters<typeof Workflow>[0];
}

/**
 * Build the workflow the viewer components consume from JSON passed in from outside.
 *
 * A real wode `Workflow` is what gives the cards their model instances, properties and statuses,
 * so that is the first choice. A config too incomplete for the entity constructor (or written
 * against another schema version) still renders: fall back to a read-only plain-JSON view rather
 * than leave the container blank — the JSON is external input, not something we control.
 */
export function createWorkflowFromConfig(input: WorkflowConfigInput | WorkflowLike): WorkflowLike {
    if (isWorkflowLike(input)) return input;
    const config = parseWorkflowConfig(input as WorkflowConfigInput);
    try {
        return new Workflow(toEntityConfig(config)) as unknown as WorkflowLike;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("wove: could not instantiate the workflow, showing raw JSON instead", error);
        return adaptWorkflowConfig(config);
    }
}
