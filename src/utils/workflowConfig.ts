import type {
    ApplicationSchema,
    JobSchema,
    SubworkflowSchema,
    WorkflowSchema,
    WorkflowUnitSchema,
} from "@mat3ra/esse/dist/js/types";
import type { Model } from "@mat3ra/mode";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import Workflow from "@mat3ra/wode/dist/js/Workflow";

/**
 * An ESSE `workflow` config, taken as possibly incomplete: JSON from outside the app is not ours
 * to assume complete, and the viewer shows what it can either way.
 */
export type WorkflowConfig = Partial<WorkflowSchema>;

/** A payload carrying the workflow one level down — an ESSE `job` config, for instance. */
export type WorkflowContainerConfig = Partial<Omit<JobSchema, "workflow">> & {
    workflow: WorkflowConfig;
};

/**
 * Workflow JSON handed in from outside: `workflow.to_json()` in a Jupyter notebook, an API
 * response, a file on disk. Either the config itself, a payload carrying one, or a JSON string of
 * either.
 */
export type WorkflowConfigInput = WorkflowConfig | WorkflowContainerConfig | string;

/** An ESSE unit schema as an instance: `id` and `toJSON()` are what the viewer needs on top of it. */
export type UnitInstance<S> = S & {
    id?: string;
    toJSON: () => S;
};

/** A unit of the workflow itself — subworkflow, map, reduce or error. */
export type WorkflowUnitInstance = UnitInstance<WorkflowUnitSchema>;

/** A unit inside a subworkflow — execution, assignment, condition, assertion, IO or error. */
export type SubworkflowUnitInstance = UnitInstance<AnySubworkflowUnitSchema>;

/**
 * A subworkflow as the cards read it, in terms of its ESSE schema: a wode `Subworkflow` on the
 * normal path, {@link adaptSubworkflowConfig}'s stand-in on the fallback one.
 */
export interface SubworkflowLike extends Omit<
    Partial<SubworkflowSchema>,
    "application" | "model" | "units"
> {
    id?: string;
    application?: Partial<ApplicationSchema>;
    model?: Partial<SubworkflowSchema["model"]>;
    /** What `OverviewAccordion` reads; a wode `Subworkflow` supplies a mode `Model` here. */
    modelInstance: Pick<Model, "isUnknown"> & Record<string, unknown>;
    unitsInstances: SubworkflowUnitInstance[];
    setIsDraft: (isDraft: boolean) => void;
    toJSON: () => Partial<SubworkflowSchema>;
    _json?: Partial<SubworkflowSchema>;
}

/**
 * A workflow as the viewer reads it. Anything exposing `unitInstances` + `subworkflowInstances`
 * renders: a wode `Workflow` (the normal case), an instance the host app already holds, or the
 * plain-JSON stand-in below.
 */
export interface WorkflowLike extends Pick<WorkflowConfig, "name"> {
    unitInstances: WorkflowUnitInstance[];
    subworkflowInstances: SubworkflowLike[];
    toJSON?: () => WorkflowConfig;
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
 * Normalize whatever came in from outside into a workflow config: parse a JSON string, and unwrap
 * the `workflow` of a job-like payload so callers can pass either one.
 */
export function parseWorkflowConfig(input: WorkflowConfigInput): WorkflowConfig {
    const parsed: unknown = typeof input === "string" ? JSON.parse(input) : input;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new TypeError("wove: workflow config must be an object or a JSON string of one");
    }
    const config = parsed as WorkflowConfig & Partial<WorkflowContainerConfig>;
    // Job-like payloads keep the workflow one level down; take it when there is nothing to show here.
    const { workflow } = config;
    if (!config.units && workflow && typeof workflow === "object" && !Array.isArray(workflow)) {
        return workflow as WorkflowConfig;
    }
    return config;
}

/** Entity list off a config, tolerating the key being absent or holding something else entirely. */
function configList<S>(config: object, key: string): S[] {
    const value = (config as Record<string, unknown>)[key];
    return Array.isArray(value) ? (value as S[]) : [];
}

/** Unit JSON as an instance: `id` for the subworkflow lookup, `toJSON()` for the flowchart. */
function adaptUnitConfig<S extends WorkflowUnitSchema | AnySubworkflowUnitSchema>(
    unit: S,
): UnitInstance<S> {
    return {
        // Cards colour their badge by status, so give units without one the idle default.
        status: "idle",
        ...unit,
        id: unit._id,
        toJSON: () => unit,
    } as UnitInstance<S>;
}

/**
 * Plain-JSON stand-in for a wode `Subworkflow` — enough of the interface for the unit cards, the
 * overview accordion and `Properties` to render read-only, with no schema validation involved.
 */
export function adaptSubworkflowConfig(config: Partial<SubworkflowSchema>): SubworkflowLike {
    const model = (config.model ?? {}) as Partial<SubworkflowSchema["model"]>;
    return {
        _json: config,
        id: config._id,
        name: config.name ?? "Subworkflow",
        application: config.application ?? {},
        model,
        properties: config.properties ?? [],
        isDraft: Boolean(config.isDraft),
        setIsDraft: (isDraft: boolean) => {
            config.isDraft = isDraft;
        },
        // `OverviewAccordion` reads `modelInstance.isUnknown`; `prop()`/`toJSON()` keep an injected
        // ModelComponent (e.g. @mat3ra/move's) from throwing on a model it cannot resolve.
        modelInstance: {
            ...model,
            isUnknown: !model.type,
            prop: () => undefined,
            toJSON: () => model,
        },
        unitsInstances: configList<AnySubworkflowUnitSchema>(config, "units").map(adaptUnitConfig),
        toJSON: () => config,
    };
}

/** Plain-JSON stand-in for a wode `Workflow`; see {@link createWorkflowFromConfig}. */
export function adaptWorkflowConfig(config: WorkflowConfig): WorkflowLike {
    return {
        name: config.name,
        unitInstances: configList<WorkflowUnitSchema>(config, "units").map(adaptUnitConfig),
        subworkflowInstances: configList<Partial<SubworkflowSchema>>(config, "subworkflows").map(
            adaptSubworkflowConfig,
        ),
        toJSON: () => config,
    };
}

/**
 * Config for the wode `Workflow` constructor: a clone (the entity holds on to, and mutates, what it
 * is handed) with the entity lists it cannot do without. `workflows` is a *required* prop and the
 * other two are mapped in the constructor, yet workflow JSON from outside routinely omits all
 * three — `Subworkflow.toJSON()`-derived payloads and hand-written configs both do.
 */
function toEntityConfig(config: WorkflowConfig): ConstructorParameters<typeof Workflow>[0] {
    const clone = JSON.parse(JSON.stringify(config)) as WorkflowConfig;
    // The cast is the boundary: past here the config is the entity's business to validate, and one
    // it rejects lands in the fallback below rather than as a type error at the call site.
    return {
        ...clone,
        units: configList<WorkflowUnitSchema>(clone, "units"),
        subworkflows: configList<SubworkflowSchema>(clone, "subworkflows"),
        workflows: configList<WorkflowSchema>(clone, "workflows"),
    } as ConstructorParameters<typeof Workflow>[0];
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
    const config = parseWorkflowConfig(input);
    try {
        // A wode `Workflow` covers `WorkflowLike` structurally: same instance lists, entity-typed.
        return new Workflow(toEntityConfig(config)) as unknown as WorkflowLike;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("wove: could not instantiate the workflow, showing raw JSON instead", error);
        return adaptWorkflowConfig(config);
    }
}
