import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import React from "react";
export type UnitCardAction = Record<string, unknown>;
export type UnitCardProps = {
    index: number;
    unit: AnySubworkflowUnitSchema;
    actions?: UnitCardAction[];
    isSelected?: boolean;
    isBorder?: boolean;
    onSelect?: (unit: AnySubworkflowUnitSchema) => void;
    animateOnHover?: boolean;
    isCardContentExpanded?: boolean;
};
export declare function UnitCard({ index, unit, actions, isSelected, isBorder, onSelect, animateOnHover, isCardContentExpanded, }: UnitCardProps): React.JSX.Element;
