import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { ReactNode } from "react";
import { MarkerType } from "reactflow";
export type NodePosition = {
    x: number;
    y: number;
};
export interface Node {
    id: string;
    type: string;
    data: NodeData;
    position: NodePosition;
    draggable: boolean;
}
type MarkerEnd = {
    type: MarkerType;
    width: number;
    height: number;
};
export interface Edge {
    id: string;
    type: string;
    source: string;
    target: string;
    sourceHandle?: string;
    label?: string;
    markerEnd: MarkerEnd;
}
export interface NodeData {
    index?: number;
    isCardContentExpanded?: boolean;
    unit?: AnySubworkflowUnitSchema;
    isSelected?: boolean;
    onSelect?: (unit: AnySubworkflowUnitSchema) => void;
    actions?: Action[];
    isSelectable?: boolean;
    animateOnHover?: boolean;
    direction: Direction;
    label?: string;
}
export declare enum Direction {
    TB = "TB",
    LR = "LR",
    RL = "RL",
    BT = "BT"
}
export interface Action {
    id: string;
    disabled: boolean;
    content: string;
    icon: ReactNode;
    onClick: () => void;
}
export {};
