import { Position } from "reactflow";
import { Direction } from "../../units/types";
function getHandlePositions(unitType, direction) {
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
            sourceHandleStyles: handleStyles[unitType] || defaultHandleStyle,
            sourceHandleLabels: handleLabels[unitType] || undefined,
        },
        LR: {
            source: Position.Right,
            target: Position.Left,
            sourceHandleStyles: handleStyles[unitType] || defaultHandleStyle,
            sourceHandleLabels: handleLabels[unitType] || undefined,
        },
    };
    return handlePositions[direction];
}
export function useNodeData(data) {
    const { index = 0, isCardContentExpanded = true, unit = {}, isSelected = false, 
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSelect = () => { }, actions, animateOnHover, direction = Direction.TB, showDeveloperInfo, showStatus, } = data;
    const handlePositions = getHandlePositions(unit.type, direction);
    const { source, target, sourceHandleStyles, sourceHandleLabels } = handlePositions;
    return {
        index,
        isCardContentExpanded,
        unit,
        isSelected,
        onSelect,
        actions,
        animateOnHover,
        showDeveloperInfo,
        showStatus,
        sourcePosition: source,
        targetPosition: target,
        sourceHandleStyles,
        sourceHandleLabels,
    };
}
