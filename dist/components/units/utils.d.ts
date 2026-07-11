import { UnitStatus } from "@mat3ra/wode/dist/js/enums";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { Direction, Edge, Node } from "./types";
/**
 * Maps a workflow unit runtime status to an EntityName / MUI-style badge color key.
 * Mirrors the former `get statusCls()` on unit models.
 */
export declare function getUnitStatusCls(status: string | undefined | null): string;
/**
 * Single aggregate status for a subworkflow (or any list of subworkflow units), from unit runtime states.
 * Matches legacy Subworkflow `get status()`: any active → active; else any terminal (non-condition, no `next`)
 * unit finished → finished; else any error → error; else idle.
 */
export declare function getWorkflowAggregateStatus(units: readonly AnySubworkflowUnitSchema[]): UnitStatus;
/** Badge color key for {@link getWorkflowAggregateStatus} (via {@link getUnitStatusCls}). */
export declare function getWorkflowStatusCls(units: readonly AnySubworkflowUnitSchema[]): string;
export declare const createEdge: (source: string, target: string, sourceHandle: string | undefined, label: string | undefined) => Edge;
export declare const createUnitNode: (unit: AnySubworkflowUnitSchema, index: number, direction: Direction, isSelected: boolean, onUnitSelect: (unit: AnySubworkflowUnitSchema) => void, areUnitsExpanded: boolean, getActions: Function) => Node;
export declare const createStartEndNode: (id: string, label: string, direction: Direction) => Node;
