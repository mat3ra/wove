import "reactflow/dist/style.css";
import type { Subworkflow } from "@mat3ra/wode";
import type { AnySubworkflowUnitSchema, DefaultSubworkflowUnitType } from "@mat3ra/wode/dist/js/units/factory";
import React from "react";
/** Local replacement for Meteor's DialogType enum — only the string value is used here. */
type WoveDialogType = string;
/** Local replacement for ReduxDialogState: a [open, close] tuple produced by useReduxDialog. */
type ReduxDialogState<_D extends WoveDialogType = WoveDialogType> = [
    (args?: Record<string, unknown>) => void,
    () => void
];
/** Opaque replacement for CorePropertyHolder — actual instances are passed as-is. */
type CorePropertyHolder = unknown;
export type UnitsFlowchartContainerProps = {
    /** Reveal flowchart IDs on unit cards; see `CardHeader`. */
    showDeveloperInfo?: boolean;
    /** Show run-status badges; off in designers, on in job views. */
    showStatus?: boolean;
    units: any[];
    unitIndex: number;
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void;
    onUnitAdd: (unitType: DefaultSubworkflowUnitType, prepend: boolean, insertAtIndex: number) => void;
    onUnitRemove: (flowchartId: string) => void;
    onUnitUpdate: (unit: AnySubworkflowUnitSchema) => void;
    onUnitClone: (unit: AnySubworkflowUnitSchema, index: number) => void;
    isStandalone?: boolean;
    editable?: boolean;
    adjustable?: boolean;
    materials?: any[];
    materialsIndex?: number;
    onMaterialSwitch?: (index: number) => void;
    onOutputUpdateRequest?: (unit: any) => void;
    publicAccount: any;
    jobProperties?: CorePropertyHolder[];
    unitTypeReduxDialog: ReduxDialogState;
    /** Passed from `Subworkflow` for layout/router context; unused here. */
    subworkflow?: Subworkflow;
    UnitModalComponent?: React.ComponentType<any>;
};
export default function UnitsFlowchartContainer({ subworkflow: _subworkflow, editable, adjustable, units, unitIndex, onUnitSelect, onUnitAdd, onUnitRemove, onUnitUpdate, onUnitClone, isStandalone, materials, materialsIndex, onMaterialSwitch, onOutputUpdateRequest, publicAccount, jobProperties, unitTypeReduxDialog, UnitModalComponent, showDeveloperInfo, showStatus, }: UnitsFlowchartContainerProps): React.JSX.Element;
export {};
