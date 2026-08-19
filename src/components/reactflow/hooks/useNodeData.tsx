import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { CSSProperties } from "react";
import { Position } from "reactflow";

import { Direction, NodeData } from "../../units/types";

interface HandlePositions {
    source: Position;
    target: Position;
    sourceHandleStyles: CSSProperties[];
    sourceHandleLabels: string[];
}

function getHandlePositions(unitType: `${UnitType}`, direction: Direction): HandlePositions {
    const defaultHandleStyle = [{ left: "50%" }];

    const handleStyles = {
        condition: [{ left: "40%" }, { left: "60%" }],
    };

    const handleLabels = {
        condition: ["else", "then"],
    };

    const handlePositions = {
        TB: {
            source: Position.Bottom,
            target: Position.Top,
            sourceHandleStyles: (handleStyles as Record<string, any>)[unitType] || defaultHandleStyle,
            sourceHandleLabels: (handleLabels as Record<string, any>)[unitType] || undefined,
        },
        LR: {
            source: Position.Right,
            target: Position.Left,
            sourceHandleStyles: (handleStyles as Record<string, any>)[unitType] || defaultHandleStyle,
            sourceHandleLabels: (handleLabels as Record<string, any>)[unitType] || undefined,
        },
    };

    return (handlePositions as Record<string, any>)[direction];
}

export function useNodeData(data: NodeData) {
    const {
        index = 0,
        isCardContentExpanded = true,
        unit = {} as AnySubworkflowUnitSchema,
        isSelected = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSelect = () => {},
        actions,
        animateOnHover,
        direction = Direction.TB,
    } = data;

    const handlePositions = getHandlePositions(unit.type as `${UnitType}`, direction);
    const { source, target, sourceHandleStyles, sourceHandleLabels } = handlePositions;

    return {
        index,
        isCardContentExpanded,
        unit,
        isSelected,
        onSelect,
        actions,
        animateOnHover,
        sourcePosition: source,
        targetPosition: target,
        sourceHandleStyles,
        sourceHandleLabels,
    };
}
