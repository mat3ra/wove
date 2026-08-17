import { UnitStatus, UnitType } from "@mat3ra/wode/dist/js/enums";
import { MarkerType } from "reactflow";
const UNIT_STATUS_TO_ENTITY_NAME_COLOR = {
    [UnitStatus.active]: "warning",
    [UnitStatus.warning]: "warning",
    [UnitStatus.finished]: "success",
    [UnitStatus.error]: "error",
};
/**
 * Maps a workflow unit runtime status to an EntityName / MUI-style badge color key.
 * Mirrors the former `get statusCls()` on unit models.
 */
export function getUnitStatusCls(status) {
    return UNIT_STATUS_TO_ENTITY_NAME_COLOR[status || ""] || "default";
}
/**
 * Single aggregate status for a subworkflow (or any list of subworkflow units), from unit runtime states.
 * Matches legacy Subworkflow `get status()`: any active → active; else any terminal (non-condition, no `next`)
 * unit finished → finished; else any error → error; else idle.
 */
export function getWorkflowAggregateStatus(units) {
    const endUnits = units.filter((unit) => unit.type !== UnitType.condition && !unit.next);
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
export function getWorkflowStatusCls(units) {
    return getUnitStatusCls(getWorkflowAggregateStatus(units));
}
export const createEdge = (source, target, sourceHandle, label) => ({
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
const createNode = (id, type, data, position = { x: 0, y: 0 }, draggable = false) => ({
    id,
    type,
    data,
    position,
    draggable,
});
export const createUnitNode = (unit, index, direction, isSelected, onUnitSelect, areUnitsExpanded, 
// eslint-disable-next-line @typescript-eslint/ban-types
getActions, cardOptions = {}) => {
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
export const createStartEndNode = (id, label, direction) => {
    return createNode(id, "defaultNode", { label, direction });
};
