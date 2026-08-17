import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import React from "react";
export type WorkflowUnitCardProps = {
    index: number;
    unit: any;
    isSelected?: boolean;
    onClick: (unit: any) => void;
    isRemovable?: boolean;
    onRemove: (flowchartId: string) => void;
    subworkflow: WodeSubworkflow | null | undefined;
    isCardContentExpanded?: boolean;
    editable?: boolean;
    headerStatusCls: (unit: any) => string;
    onUpdate?: (subworkflow: SubworkflowSchema) => void;
    onApplicationUpdate?: (...args: unknown[]) => void;
    onModelUpdate?: (...args: unknown[]) => void;
    ApplicationComponent?: React.ComponentType<any>;
    ModelComponent?: React.ComponentType<any>;
    /** See {@link CardHeaderProps.showDeveloperInfo}. */
    showDeveloperInfo?: boolean;
    /** See {@link CardHeaderProps.showStatus}. */
    showStatus?: boolean;
};
export declare function WorkflowUnitCard({ index, unit, isSelected, onClick, isRemovable, onRemove, subworkflow, isCardContentExpanded, editable, headerStatusCls, onUpdate, onApplicationUpdate, onModelUpdate, ApplicationComponent, ModelComponent, showDeveloperInfo, showStatus, }: WorkflowUnitCardProps): React.JSX.Element;
