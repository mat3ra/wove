import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow, Workflow as WodeWorkflow } from "@mat3ra/wode";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnyWorkflowUnit } from "@mat3ra/wode/dist/js/units/factory";
import Box from "@mui/material/Box";
import React, { useCallback } from "react";

import { WorkflowUnitCard } from "./WorkflowUnitCard";

export type WorkflowUnitsFlowchartProps = {
    workflow: any;
    activeUnit: any;
    onClick: (unit: any) => void;
    isCardContentExpanded?: boolean;
    headerStatusCls: (unit: any) => string;
    editable?: boolean;
    onUnitRemove?: (flowchartId?: string) => void;
    onSubworkflowUnitUpdate?: (subworkflow: SubworkflowSchema) => void;
};

export function WorkflowUnitsFlowchart({
    workflow,
    activeUnit,
    onClick,
    isCardContentExpanded,
    headerStatusCls,
    editable = false,
    onUnitRemove,
    onSubworkflowUnitUpdate,
}: WorkflowUnitsFlowchartProps) {
    const renderUnit = useCallback(
        (unit: any, index: number, sw: WodeSubworkflow | null) => {
            return (
                <Box key={unit.flowchartId} sx={{ mt: index ? 2 : 0 }}>
                    <WorkflowUnitCard
                        headerStatusCls={headerStatusCls}
                        editable={editable}
                        subworkflow={sw ?? undefined}
                        onUpdate={onSubworkflowUnitUpdate}
                        onRemove={onUnitRemove ?? (() => undefined)}
                        isRemovable={editable}
                        index={index + 1}
                        unit={unit}
                        isSelected={unit.flowchartId === activeUnit.flowchartId}
                        onClick={onClick}
                        isCardContentExpanded={isCardContentExpanded}
                    />
                </Box>
            );
        },
        [
            headerStatusCls,
            editable,
            onSubworkflowUnitUpdate,
            onUnitRemove,
            activeUnit.flowchartId,
            onClick,
            isCardContentExpanded,
        ],
    );

    const elements: React.ReactNode[] = [];
    workflow.unitInstances.forEach((unitUntyped, i) => {
        const unit = unitUntyped;
        let sw: WodeSubworkflow | null = null;
        if (unit.type === UnitType.subworkflow) {
            sw = workflow.subworkflowInstances.find((s) => s.id === unit.id) ?? null;
            if (sw) {
                unit.name = sw.name;
            }
        }

        elements.push(renderUnit(unit, i, sw));
    });

    return <div className="card-body">{elements}</div>;
}
