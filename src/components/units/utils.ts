import { UnitStatus, UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { MarkerType } from "reactflow";

import { Direction, Edge, Node, NodeData, NodePosition } from "./types";

const UNIT_STATUS_TO_ENTITY_NAME_COLOR: Record<string, string> = {
    [UnitStatus.active]: "warning",
    [UnitStatus.warning]: "warning",
    [UnitStatus.finished]: "success",
    [UnitStatus.error]: "error",
};

/**
 * Maps a workflow unit runtime status to an EntityName / MUI-style badge color key.
 * Mirrors the former `get statusCls()` on unit models.
 */
export function getUnitStatusCls(status: string | undefined | null): string {
    return UNIT_STATUS_TO_ENTITY_NAME_COLOR[status || ""] || "default";
}

/**
 * Single aggregate status for a subworkflow (or any list of subworkflow units), from unit runtime states.
 * Matches legacy Subworkflow `get status()`: any active → active; else any terminal (non-condition, no `next`)
 * unit finished → finished; else any error → error; else idle.
 */
export function getWorkflowAggregateStatus(units: readonly AnySubworkflowUnitSchema[]): UnitStatus {
    const endUnits = units.filter(
        (unit) => unit.type !== UnitType.condition && !(unit as { next?: unknown }).next,
    );

    if (units.some((u) => u.status === UnitStatus.active)) {
        return UnitStatus.active;
    }
    if (endUnits.some((u) => u.status === UnitStatus.finished)) {
        return UnitStatus.finished;
    }
    if (units.some((u) => u.status === UnitStatus.error)) {
        return UnitStatus.error;
    }
    return UnitStatus.idle;
}

/** Badge color key for {@link getWorkflowAggregateStatus} (via {@link getUnitStatusCls}). */
export function getWorkflowStatusCls(units: readonly AnySubworkflowUnitSchema[]): string {
    return getUnitStatusCls(getWorkflowAggregateStatus(units));
}

export const createEdge = (
    source: string,
    target: string,
    sourceHandle: string | undefined,
    label: string | undefined,
): Edge => ({
    id: `${source}-${target}`,
    type: "smoothstep",
    source,
    target,
    sourceHandle,
    label,
    markerEnd: {
        type: MarkerType.Arrow,
        width: 20,
        height: 20,
    },
});

const createNode = (
    id: string,
    type: string,
    data: NodeData,
    position: NodePosition = { x: 0, y: 0 },
    draggable = false,
): Node => ({
    id,
    type,
    data,
    position,
    draggable,
});

export const createUnitNode = (
    unit: AnySubworkflowUnitSchema,
    index: number,
    direction: Direction,
    isSelected: boolean,
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void,
    areUnitsExpanded: boolean,
    // eslint-disable-next-line @typescript-eslint/ban-types
    getActions: Function,
    cardOptions: { showDeveloperInfo?: boolean; showStatus?: boolean } = {},
): Node => {
    const nodeType = "unitNode";
    return createNode(unit.flowchartId, nodeType, {
        index: index + 1,
        isCardContentExpanded: areUnitsExpanded,
        unit,
        isSelected,
        onSelect: onUnitSelect,
        actions: getActions(unit, index),
        isSelectable: true,
        animateOnHover: true,
        direction,
        showDeveloperInfo: cardOptions.showDeveloperInfo,
        showStatus: cardOptions.showStatus,
    });
};

export const createStartEndNode = (id: string, label: string, direction: Direction): Node => {
    return createNode(id, "defaultNode", { label, direction });
};
