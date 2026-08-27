/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { JobSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry, WorkflowStandata } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import Workflow from "@mat3ra/wode/dist/js/Workflow";

import { createWorkflowFromConfig, parseWorkflowConfig } from "../src/utils/workflowConfig";

// wode entities validate against the ESSE schemas and resolve applications through the registry,
// both of which the host registers at startup (`src/standalone/bootstrap.ts` for the bundle).
JSONSchemasInterface.setSchemas(esseSchemas as any);
ApplicationRegistry.setDriver(new StandataDriver());

/** Real ESSE workflow configs — the same JSON the viewer is handed from outside. */
const standataWorkflows = new WorkflowStandata().getAll() as unknown as WorkflowSchema[];
const workflowConfig = standataWorkflows.find((wf) => wf.subworkflows?.length > 0)!;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// parseWorkflowConfig
// ---------------------------------------------------------------------------

test("parseWorkflowConfig returns a config object as-is", () => {
    const config = clone(workflowConfig);
    assert.strictEqual(parseWorkflowConfig(config), config);
});

test("parseWorkflowConfig parses a JSON string", () => {
    const config = parseWorkflowConfig(JSON.stringify(workflowConfig));
    assert.strictEqual(config.name, workflowConfig.name);
    assert.strictEqual(config.units.length, workflowConfig.units.length);
});

test("parseWorkflowConfig unwraps the workflow of a job-like payload", () => {
    const job = { _id: "job-1", name: "job", workflow: workflowConfig } as unknown as JobSchema;
    assert.strictEqual(parseWorkflowConfig(job).name, workflowConfig.name);
});

test("parseWorkflowConfig keeps a workflow that has both units and a nested workflow", () => {
    const config = parseWorkflowConfig({ ...clone(workflowConfig), workflow: { name: "other" } });
    assert.strictEqual(config.name, workflowConfig.name);
});

test("parseWorkflowConfig takes the config off an entity that has one", () => {
    const entity = createWorkflowFromConfig(clone(workflowConfig));
    assert.strictEqual(parseWorkflowConfig(entity).name, workflowConfig.name);
});

test("parseWorkflowConfig throws on input that is not an object", () => {
    assert.throws(() => parseWorkflowConfig("[]"), TypeError);
    assert.throws(() => parseWorkflowConfig(42 as unknown as WorkflowSchema), TypeError);
    assert.throws(() => parseWorkflowConfig(null as unknown as WorkflowSchema), TypeError);
});

// ---------------------------------------------------------------------------
// createWorkflowFromConfig
// ---------------------------------------------------------------------------

test("createWorkflowFromConfig builds a wode Workflow from every standata workflow", () => {
    assert.ok(standataWorkflows.length > 0);
    standataWorkflows.forEach((config) => {
        const workflow = createWorkflowFromConfig(clone(config));
        assert.ok(workflow instanceof Workflow);
        assert.strictEqual(workflow.unitInstances.length, config.units.length);
        assert.strictEqual(workflow.subworkflowInstances.length, config.subworkflows.length);
    });
});

test("createWorkflowFromConfig links workflow units to their subworkflows by id", () => {
    const workflow = createWorkflowFromConfig(clone(workflowConfig));
    // What `WorkflowUnitsFlowchart` matches on to put a subworkflow on its unit's card.
    workflow.unitInstances.forEach((unit) => {
        assert.ok(workflow.subworkflowInstances.some((sw) => sw.id === unit.id));
    });
});

test("createWorkflowFromConfig accepts a JSON string", () => {
    const workflow = createWorkflowFromConfig(JSON.stringify(workflowConfig));
    assert.strictEqual(workflow.unitInstances.length, workflowConfig.units.length);
});

test("createWorkflowFromConfig defaults the required entity lists a config may omit", () => {
    // `units`, `subworkflows` and `workflows` are required by the schema, yet JSON from outside
    // (`Subworkflow.toJSON()`-derived payloads, hand-written configs) routinely omits empty ones.
    const workflow = createWorkflowFromConfig({ name: "empty" } as unknown as WorkflowSchema);
    assert.deepStrictEqual(workflow.unitInstances, []);
    assert.deepStrictEqual(workflow.subworkflowInstances, []);
});

test("createWorkflowFromConfig does not mutate the config it is given", () => {
    const config = clone(workflowConfig);
    const before = JSON.stringify(config);
    createWorkflowFromConfig(config);
    assert.strictEqual(JSON.stringify(config), before);
});

test("createWorkflowFromConfig passes a workflow instance straight through", () => {
    const instance = createWorkflowFromConfig(clone(workflowConfig));
    assert.strictEqual(createWorkflowFromConfig(instance), instance);
});

test("createWorkflowFromConfig throws on a config the schemas reject", () => {
    // ESSE requires `application` on an execution unit, so the wode unit factory rejects this one.
    const config = clone(workflowConfig);
    config.subworkflows[0].units = [
        { flowchartId: "u-1", name: "pw_scf", type: "execution", head: true },
    ] as unknown as WorkflowSchema["subworkflows"][number]["units"];
    assert.throws(() => createWorkflowFromConfig(config));
});

// ---------------------------------------------------------------------------
// what the viewer reads off the entity
// ---------------------------------------------------------------------------

test("the built workflow exposes what the cards render", () => {
    const workflow = createWorkflowFromConfig(clone(workflowConfig));
    const [subworkflow] = workflow.subworkflowInstances;
    assert.strictEqual(typeof subworkflow.name, "string");
    assert.ok(Array.isArray(subworkflow.properties));
    assert.ok(Array.isArray(subworkflow.unitsInstances));
    // `OverviewAccordion` reads `modelInstance.isUnknown`; the flowchart renders unit JSON.
    assert.strictEqual(typeof subworkflow.modelInstance.isUnknown, "boolean");
    subworkflow.unitsInstances.forEach((unit) => {
        assert.strictEqual(typeof unit.toJSON().flowchartId, "string");
    });
});

test("the built workflow rolls up its applications for the header", () => {
    const workflow = createWorkflowFromConfig(clone(workflowConfig));
    // `WorkflowViewer` chips these; the entity dedupes them and covers nested workflows.
    assert.ok(workflow.usedApplications.length > 0);
    workflow.usedApplications.forEach((application) => {
        assert.strictEqual(typeof application.name, "string");
    });
});
