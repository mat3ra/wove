import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow, Workflow as WodeWorkflow } from "@mat3ra/wode";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnyWorkflowUnit } from "@mat3ra/wode/dist/js/units/factory";
import Box from "@mui/material/Box";
import React, { useCallback } from "react";

import { WorkflowUnitCard } from "./WorkflowUnitCard";

export type WorkflowUnitsFlowchartProps = {
    workflow: WodeWorkflow;
    activeUnit: AnyWorkflowUnit | undefined;
    onClick: (unit: AnyWorkflowUnit) => void;
    isCardContentExpanded?: boolean;
    headerStatusCls: (unit: AnyWorkflowUnit) => string;
    editable?: boolean;
    onUnitRemove?: (flowchartId?: string) => void;
    onSubworkflowUnitUpdate?: (subworkflow: SubworkflowSchema) => void;
    ApplicationComponent?: React.ComponentType<any>;
    ModelComponent?: React.ComponentType<any>;
    /** Reveal flowchart IDs on the cards; see `CardHeader`. */
    showDeveloperInfo?: boolean;
    /** Show run-status badges; off in designers, on in job views. */
    showStatus?: boolean;
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
    ApplicationComponent,
    ModelComponent,
    showDeveloperInfo = false,
    showStatus = true,
}: WorkflowUnitsFlowchartProps) {
    const renderUnit = useCallback(
        (unit: AnyWorkflowUnit, index: number, sw: WodeSubworkflow | null) => {
            return (
                <Box key={unit.flowchartId} sx={{ mt: index ? 2 : 0 }}>
                    <WorkflowUnitCard
                        headerStatusCls={headerStatusCls}
                        editable={editable}
                        showDeveloperInfo={showDeveloperInfo}
                        showStatus={showStatus}
                        subworkflow={sw ?? undefined}
                        onUpdate={onSubworkflowUnitUpdate}
                        onRemove={onUnitRemove ?? (() => undefined)}
                        // Offer Delete only when there is something to remove the unit with:
                        // `editable` alone would enable a button whose click goes nowhere.
                        isRemovable={editable && Boolean(onUnitRemove)}
                        index={index + 1}
                        unit={unit}
                        isSelected={unit.flowchartId === activeUnit?.flowchartId}
                        onClick={onClick}
                        isCardContentExpanded={isCardContentExpanded}
                        ApplicationComponent={ApplicationComponent}
                        ModelComponent={ModelComponent}
                    />
                </Box>
            );
        },
        [
            headerStatusCls,
            editable,
            onSubworkflowUnitUpdate,
            onUnitRemove,
            activeUnit?.flowchartId,
            onClick,
            isCardContentExpanded,
            ApplicationComponent,
            ModelComponent,
        ],
    );

    const elements: React.ReactNode[] = [];
    workflow.unitInstances.forEach((unit, i) => {
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
