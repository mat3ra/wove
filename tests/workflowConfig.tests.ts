/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";

import {
    adaptSubworkflowConfig,
    adaptWorkflowConfig,
    createWorkflowFromConfig,
    isWorkflowLike,
    parseWorkflowConfig,
    type WorkflowConfig,
} from "../src/utils/workflowConfig";

// wode entities validate against the ESSE schemas, which the host registers at startup
// (`src/standalone/bootstrap.ts` for the bundle).
JSONSchemasInterface.setSchemas(esseSchemas as any);

/**
 * A workflow config as it arrives from outside: two subworkflow units linked to two subworkflows
 * by `_id`, no `workflows` key (which the wode entity requires), and units carrying only the
 * fields the viewer reads — hence the casts, and hence the fallback path this exercises.
 */
const subworkflowConfigs = [
    {
        _id: "sw-1",
        name: "SCF",
        application: { name: "espresso", version: "6.3", shortName: "qe" },
        model: { type: "dft", subtype: "gga" },
        properties: ["total_energy"],
        units: [{ flowchartId: "sw-1-u-1", name: "pw_scf", type: "execution", head: true }],
    },
    { _id: "sw-2", name: "Band structure", model: {}, properties: [], units: [] },
] as unknown as Partial<SubworkflowSchema>[];

const workflowConfig = {
    _id: "wf-1",
    name: "Demo workflow",
    units: [
        {
            _id: "sw-1",
            flowchartId: "u-1",
            name: "SCF",
            type: "subworkflow",
            status: "finished",
            head: true,
            next: "u-2",
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            results: [],
        },
        {
            _id: "sw-2",
            flowchartId: "u-2",
            name: "Band structure",
            type: "subworkflow",
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            results: [],
        },
    ],
    subworkflows: subworkflowConfigs,
} as unknown as WorkflowConfig;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/** Silence the fallback's warning while asserting on the fallback itself. */
function withoutWarnings<T>(fn: () => T): T {
    const { warn } = console;
    console.warn = () => undefined;
    try {
        return fn();
    } finally {
        console.warn = warn;
    }
}

// ---------------------------------------------------------------------------
// parseWorkflowConfig
// ---------------------------------------------------------------------------

test("parseWorkflowConfig returns a config object as-is", () => {
    const config = clone(workflowConfig);
    assert.strictEqual(parseWorkflowConfig(config), config);
});

test("parseWorkflowConfig parses a JSON string", () => {
    const config = parseWorkflowConfig(JSON.stringify(workflowConfig));
    assert.strictEqual(config.name, "Demo workflow");
    assert.strictEqual(config.units?.length, 2);
});

test("parseWorkflowConfig unwraps the workflow of a job-like payload", () => {
    const config = parseWorkflowConfig({ _id: "job-1", name: "job", workflow: workflowConfig });
    assert.strictEqual(config.name, "Demo workflow");
});

test("parseWorkflowConfig keeps a workflow that has both units and a nested workflow", () => {
    const config = parseWorkflowConfig({ ...workflowConfig, workflow: { name: "other" } });
    assert.strictEqual(config.name, "Demo workflow");
});

test("parseWorkflowConfig throws on input that is not an object", () => {
    assert.throws(() => parseWorkflowConfig("[]"), TypeError);
    assert.throws(() => parseWorkflowConfig(42 as unknown as WorkflowConfig), TypeError);
    assert.throws(() => parseWorkflowConfig(null as unknown as WorkflowConfig), TypeError);
});

// ---------------------------------------------------------------------------
// isWorkflowLike
// ---------------------------------------------------------------------------

test("isWorkflowLike detects objects exposing both instance lists", () => {
    assert.strictEqual(isWorkflowLike({ unitInstances: [], subworkflowInstances: [] }), true);
    assert.strictEqual(isWorkflowLike({ unitInstances: [] }), false);
    assert.strictEqual(isWorkflowLike(workflowConfig), false);
    assert.strictEqual(isWorkflowLike(null), false);
});

// ---------------------------------------------------------------------------
// createWorkflowFromConfig
// ---------------------------------------------------------------------------

test("createWorkflowFromConfig links workflow units to their subworkflows by id", () => {
    const workflow = withoutWarnings(() => createWorkflowFromConfig(clone(workflowConfig)));
    assert.strictEqual(workflow.unitInstances.length, 2);
    assert.strictEqual(workflow.subworkflowInstances.length, 2);
    // What `WorkflowUnitsFlowchart` matches on to put a subworkflow on its unit's card.
    workflow.unitInstances.forEach((unit: any) => {
        assert.ok(workflow.subworkflowInstances.some((sw: any) => sw.id === unit.id));
    });
});

test("createWorkflowFromConfig accepts a JSON string", () => {
    const workflow = withoutWarnings(() =>
        createWorkflowFromConfig(JSON.stringify(workflowConfig)),
    );
    assert.strictEqual(workflow.unitInstances.length, 2);
});

test("createWorkflowFromConfig instantiates a wode Workflow for a complete config", () => {
    // No units to instantiate, so nothing can send this down the fallback path.
    const workflow = createWorkflowFromConfig({ name: "empty", units: [], subworkflows: [] });
    assert.strictEqual(workflow.constructor.name, "Workflow");
    assert.deepStrictEqual(workflow.unitInstances, []);
});

test("createWorkflowFromConfig falls back to a JSON view when the entity cannot be built", () => {
    // An execution unit without an application is rejected by the wode unit factory.
    const workflow = withoutWarnings(() => createWorkflowFromConfig(clone(workflowConfig)));
    const [subworkflow] = workflow.subworkflowInstances;
    assert.strictEqual(subworkflow.name, "SCF");
    assert.deepStrictEqual(subworkflow.properties, ["total_energy"]);
    assert.strictEqual(subworkflow.unitsInstances.length, 1);
    // The flowchart renders unit JSON, so instances have to hand theirs back.
    assert.strictEqual(subworkflow.unitsInstances[0].toJSON().name, "pw_scf");
});

test("createWorkflowFromConfig does not mutate the config it is given", () => {
    const config = clone(workflowConfig);
    const before = JSON.stringify(config);
    withoutWarnings(() => createWorkflowFromConfig(config));
    assert.strictEqual(JSON.stringify(config), before);
});

test("createWorkflowFromConfig passes a workflow instance straight through", () => {
    const instance = { unitInstances: [], subworkflowInstances: [], name: "already built" };
    assert.strictEqual(createWorkflowFromConfig(instance), instance);
});

// ---------------------------------------------------------------------------
// adaptWorkflowConfig / adaptSubworkflowConfig
// ---------------------------------------------------------------------------

test("adaptWorkflowConfig exposes units and subworkflows as instances", () => {
    const workflow = adaptWorkflowConfig(clone(workflowConfig));
    assert.strictEqual(workflow.name, "Demo workflow");
    assert.strictEqual(workflow.unitInstances[0].id, "sw-1");
    assert.strictEqual(workflow.unitInstances[0].status, "finished");
    // Units with no status of their own still get one — the cards colour their badge by it.
    assert.strictEqual(workflow.unitInstances[1].status, "idle");
    assert.strictEqual(workflow.subworkflowInstances.length, 2);
});

test("adaptWorkflowConfig tolerates missing and malformed entity lists", () => {
    assert.deepStrictEqual(adaptWorkflowConfig({ name: "no units" }).unitInstances, []);
    const junk = adaptWorkflowConfig({
        units: "nope",
        subworkflows: 7,
    } as unknown as WorkflowConfig);
    assert.deepStrictEqual(junk.unitInstances, []);
    assert.deepStrictEqual(junk.subworkflowInstances, []);
});

test("adaptSubworkflowConfig marks a model without a type as unknown", () => {
    const withModel = adaptSubworkflowConfig(subworkflowConfigs[0]);
    assert.strictEqual(withModel.modelInstance.isUnknown, false);
    const withoutModel = adaptSubworkflowConfig({ _id: "sw-3", name: "No model" });
    assert.strictEqual(withoutModel.modelInstance.isUnknown, true);
    assert.deepStrictEqual(withoutModel.properties, []);
});

test("adaptSubworkflowConfig tracks the draft flag", () => {
    const config: Partial<SubworkflowSchema> = { _id: "sw-4", name: "Draft", isDraft: true };
    const subworkflow = adaptSubworkflowConfig(config);
    assert.strictEqual(subworkflow.isDraft, true);
    subworkflow.setIsDraft(false);
    assert.strictEqual(config.isDraft, false);
    assert.strictEqual(subworkflow.toJSON(), config);
});
