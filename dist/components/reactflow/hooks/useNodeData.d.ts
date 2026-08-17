import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { CSSProperties } from "react";
import { Position } from "reactflow";
import { NodeData } from "../../units/types";
export declare function useNodeData(data: NodeData): {
    index: number;
    isCardContentExpanded: boolean;
    unit: AnySubworkflowUnitSchema;
    isSelected: boolean;
    onSelect: (unit: AnySubworkflowUnitSchema) => void;
    actions: import("../../units/types").Action[] | undefined;
    animateOnHover: boolean | undefined;
    showDeveloperInfo: boolean | undefined;
    showStatus: boolean | undefined;
    sourcePosition: Position;
    targetPosition: Position;
    sourceHandleStyles: CSSProperties[];
    sourceHandleLabels: string[];
};
