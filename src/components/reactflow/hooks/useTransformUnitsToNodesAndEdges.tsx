import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";

import { type Edge as UnitFlowEdge, Action, Direction } from "../../units/types";
import { createEdge, createStartEndNode, createUnitNode } from "../../units/utils";

/** Outgoing flowchart edges for one subworkflow unit (order preserved via `units.flatMap`). */
function edgesForSubworkflowUnit(unit: AnySubworkflowUnitSchema): UnitFlowEdge[] {
    if (unit.type === UnitType.condition) {
        const segment: UnitFlowEdge[] = [];
        if (unit.then) {
            segment.push(createEdge(unit.flowchartId, unit.then, "then", "then"));
        } else if (unit.next) {
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

interface Props {
    units: AnySubworkflowUnitSchema[];
    direction: Direction;
    unitIndex: number;
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void;
    areUnitsExpanded: boolean;
    getActions: (unit: AnySubworkflowUnitSchema, index: number) => Action[];
    showDeveloperInfo?: boolean;
    showStatus?: boolean;
}

export function transformUnitsToNodesAndEdges(props: Props) {
    const {
        units,
        direction,
        unitIndex,
        onUnitSelect,
        areUnitsExpanded,
        getActions,
        showDeveloperInfo,
        showStatus,
    } = props;

    // map units to reactflow nodes
    const unitNodes = units.map((unit, index) =>
        createUnitNode(
            unit,
            index,
            direction,
            index === unitIndex,
            onUnitSelect,
            areUnitsExpanded,
            getActions,
            { showDeveloperInfo, showStatus },
        ),
    );

    const startNode = createStartEndNode("start", "Start", direction);
    const endNode = createStartEndNode("end", "End", direction);

    // map units to reactflow edges (flatMap keeps unit order; avoid filter+flatMap in two passes
    // which would batch all condition edges before non-condition edges).
    const edges = units.flatMap(edgesForSubworkflowUnit);
    // appends "virtual" start and end node edges for visualization
    // Empty units (e.g. after subworkflow application switch clears units in wode) must still get a
    // valid target — otherwise React Flow gets source→"" and a broken graph.
    const headNodeId =
        units.find((u) => u.head)?.flowchartId ?? (units.length > 0 ? units[0].flowchartId : "end");
    const startEdge = createEdge("start", headNodeId, undefined, undefined);
    const endEdges = units
        .filter((unit) => !unit.next)
        .map((unit) =>
            createEdge(
                unit.flowchartId,
                `end`,
                unit.type === UnitType.condition ? "then" : undefined,
                unit.type === UnitType.condition ? "then" : undefined,
            ),
        );

    return {
        nodes: [startNode, ...unitNodes, endNode],
        edges: [startEdge, ...edges, ...endEdges],
    };
}
