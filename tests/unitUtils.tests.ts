/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import { UnitStatus, UnitType } from "@mat3ra/wode/dist/js/enums";

import {
    createEdge,
    createStartEndNode,
    getUnitStatusCls,
    getWorkflowAggregateStatus,
    getWorkflowStatusCls,
} from "../src/components/units/utils";

// ---------------------------------------------------------------------------
// getUnitStatusCls
// ---------------------------------------------------------------------------

test("getUnitStatusCls maps UnitStatus.active to 'warning'", () => {
    assert.strictEqual(getUnitStatusCls(UnitStatus.active), "warning");
});

test("getUnitStatusCls maps UnitStatus.warning to 'warning'", () => {
    assert.strictEqual(getUnitStatusCls(UnitStatus.warning), "warning");
});

test("getUnitStatusCls maps UnitStatus.finished to 'success'", () => {
    assert.strictEqual(getUnitStatusCls(UnitStatus.finished), "success");
});

test("getUnitStatusCls maps UnitStatus.error to 'error'", () => {
    assert.strictEqual(getUnitStatusCls(UnitStatus.error), "error");
});

test("getUnitStatusCls returns 'default' for undefined", () => {
    assert.strictEqual(getUnitStatusCls(undefined), "default");
});

test("getUnitStatusCls returns 'default' for null", () => {
    assert.strictEqual(getUnitStatusCls(null), "default");
});

test("getUnitStatusCls returns 'default' for unknown status string", () => {
    assert.strictEqual(getUnitStatusCls("unknown-status"), "default");
});

// ---------------------------------------------------------------------------
// getWorkflowAggregateStatus
// ---------------------------------------------------------------------------

function makeUnit(
    type: string,
    status: string,
    extra?: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    return { type, status, ...extra };
}

test("getWorkflowAggregateStatus returns active when any unit is active", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.active),
        makeUnit(UnitType.execution, UnitStatus.finished),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.active);
});

test("getWorkflowAggregateStatus returns finished when a non-condition end unit is finished", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.finished),
        makeUnit(UnitType.execution, UnitStatus.idle),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.finished);
});

test("getWorkflowAggregateStatus does not count condition units as end units for finished check", () => {
    const units = [
        makeUnit(UnitType.condition, UnitStatus.finished),
        makeUnit(UnitType.execution, UnitStatus.idle),
    ];
    // condition finished does not count as workflow finished
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.idle);
});

test("getWorkflowAggregateStatus does not count units with 'next' as end units for finished check", () => {
    const units = [makeUnit(UnitType.execution, UnitStatus.finished, { next: "some-unit" })];
    // has 'next' so not an end unit
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.idle);
});

test("getWorkflowAggregateStatus returns error when any unit has error status", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.idle),
        makeUnit(UnitType.execution, UnitStatus.error),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.error);
});

test("getWorkflowAggregateStatus returns idle when no notable status exists", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.idle),
        makeUnit(UnitType.execution, UnitStatus.idle),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.idle);
});

test("getWorkflowAggregateStatus active takes priority over finished", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.finished),
        makeUnit(UnitType.execution, UnitStatus.active),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.active);
});

test("getWorkflowAggregateStatus finished takes priority over error", () => {
    const units = [
        makeUnit(UnitType.execution, UnitStatus.finished),
        makeUnit(UnitType.execution, UnitStatus.error),
    ];
    assert.strictEqual(getWorkflowAggregateStatus(units), UnitStatus.finished);
});

// ---------------------------------------------------------------------------
// getWorkflowStatusCls
// ---------------------------------------------------------------------------

test("getWorkflowStatusCls returns 'warning' for active units", () => {
    const units = [makeUnit(UnitType.execution, UnitStatus.active)];
    assert.strictEqual(getWorkflowStatusCls(units), "warning");
});

test("getWorkflowStatusCls returns 'success' for finished workflow", () => {
    const units = [makeUnit(UnitType.execution, UnitStatus.finished)];
    assert.strictEqual(getWorkflowStatusCls(units), "success");
});

test("getWorkflowStatusCls returns 'default' for idle workflow", () => {
    const units = [makeUnit(UnitType.execution, UnitStatus.idle)];
    assert.strictEqual(getWorkflowStatusCls(units), "default");
});

// ---------------------------------------------------------------------------
// createEdge
// ---------------------------------------------------------------------------

test("createEdge returns object with id equal to 'source-target'", () => {
    const edge = createEdge("nodeA", "nodeB", "handle1", "my label");
    assert.strictEqual(edge.id, "nodeA-nodeB");
});

test("createEdge returns object with type 'smoothstep'", () => {
    const edge = createEdge("nodeA", "nodeB", "handle1", "my label");
    assert.strictEqual(edge.type, "smoothstep");
});

test("createEdge preserves source and target", () => {
    const edge = createEdge("src", "tgt", undefined, undefined);
    assert.strictEqual(edge.source, "src");
    assert.strictEqual(edge.target, "tgt");
});

test("createEdge preserves sourceHandle and label", () => {
    const edge = createEdge("s", "t", "myHandle", "myLabel");
    assert.strictEqual(edge.sourceHandle, "myHandle");
    assert.strictEqual(edge.label, "myLabel");
});

test("createEdge includes markerEnd with Arrow type", () => {
    const edge = createEdge("s", "t", undefined, undefined);
    assert.ok(edge.markerEnd, "markerEnd should be defined");
    assert.ok(typeof edge.markerEnd === "object");
});

// ---------------------------------------------------------------------------
// createStartEndNode
// ---------------------------------------------------------------------------

test("createStartEndNode returns node with type 'defaultNode'", () => {
    const node = createStartEndNode("start", "Start", "LR");
    assert.strictEqual(node.type, "defaultNode");
});

test("createStartEndNode preserves id", () => {
    const node = createStartEndNode("end-node", "End", "TB");
    assert.strictEqual(node.id, "end-node");
});

test("createStartEndNode includes label and direction in data", () => {
    const node = createStartEndNode("start", "Start Label", "LR");
    assert.strictEqual((node.data as { label: string }).label, "Start Label");
    assert.strictEqual((node.data as { direction: string }).direction, "LR");
});
