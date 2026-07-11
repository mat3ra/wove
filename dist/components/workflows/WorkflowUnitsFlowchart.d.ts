import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import React from "react";
export type WorkflowUnitsFlowchartProps = {
    workflow: any;
    activeUnit: any;
    onClick: (unit: any) => void;
    isCardContentExpanded?: boolean;
    headerStatusCls: (unit: any) => string;
    editable?: boolean;
    onUnitRemove?: (flowchartId?: string) => void;
    onSubworkflowUnitUpdate?: (subworkflow: SubworkflowSchema) => void;
    ApplicationComponent?: React.ComponentType<any>;
    ModelComponent?: React.ComponentType<any>;
};
export declare function WorkflowUnitsFlowchart({ workflow, activeUnit, onClick, isCardContentExpanded, headerStatusCls, editable, onUnitRemove, onSubworkflowUnitUpdate, ApplicationComponent, ModelComponent, }: WorkflowUnitsFlowchartProps): React.JSX.Element;
