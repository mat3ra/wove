import { UnitType } from "@mat3ra/wode/dist/js/enums";
import { createEdge, createStartEndNode, createUnitNode } from "../../units/utils";
/** Outgoing flowchart edges for one subworkflow unit (order preserved via `units.flatMap`). */
function edgesForSubworkflowUnit(unit) {
    if (unit.type === UnitType.condition) {
        const segment = [];
        if (unit.then) {
            segment.push(createEdge(unit.flowchartId, unit.then, "then", "then"));
        }
        else if (unit.next) {
            segment.push(createEdge(unit.flowchartId, unit.next, undefined, undefined));
        }
        if (unit.else) {
            segment.push(createEdge(unit.flowchartId, unit.else, "else", "else"));
        }
        return segment;
    }
    if (unit.next) {
        return [createEdge(unit.flowchartId, unit.next, undefined, undefined)];
    }
    return [];
}
export function transformUnitsToNodesAndEdges(props) {
    var _a, _b;
    const { units, direction, unitIndex, onUnitSelect, areUnitsExpanded, getActions } = props;
    // map units to reactflow nodes
    const unitNodes = units.map((unit, index) => createUnitNode(unit, index, direction, index === unitIndex, onUnitSelect, areUnitsExpanded, getActions));
    const startNode = createStartEndNode("start", "Start", direction);
    const endNode = createStartEndNode("end", "End", direction);
    // map units to reactflow edges (flatMap keeps unit order; avoid filter+flatMap in two passes
    // which would batch all condition edges before non-condition edges).
    const edges = units.flatMap(edgesForSubworkflowUnit);
    // appends "virtual" start and end node edges for visualization
    // Empty units (e.g. after subworkflow application switch clears units in wode) must still get a
    // valid target — otherwise React Flow gets source→"" and a broken graph.
    const headNodeId = (_b = (_a = units.find((u) => u.head)) === null || _a === void 0 ? void 0 : _a.flowchartId) !== null && _b !== void 0 ? _b : (units.length > 0 ? units[0].flowchartId : "end");
    const startEdge = createEdge("start", headNodeId, undefined, undefined);
    const endEdges = units
        .filter((unit) => !unit.next)
        .map((unit) => createEdge(unit.flowchartId, `end`, unit.type === UnitType.condition ? "then" : undefined, unit.type === UnitType.condition ? "then" : undefined));
    return {
        nodes: [startNode, ...unitNodes, endNode],
        edges: [startEdge, ...edges, ...endEdges],
    };
}
