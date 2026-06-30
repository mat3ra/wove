import "reactflow/dist/style.css";

import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon";
import type { Subworkflow } from "@mat3ra/wode";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type {
    AnySubworkflowUnit,
    AnySubworkflowUnitSchema,
    DefaultSubworkflowUnitType,
} from "@mat3ra/wode/dist/js/units/factory";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import s from "underscore.string";

import type { Action } from "./types";
import UnitsFlowchart from "./UnitsFlowchart";
import UnitsFlowchartDropdown from "./UnitsFlowchartDropdown";

/** Local replacement for Meteor's DialogType enum — only the string value is used here. */
type WoveDialogType = string;
/** Local replacement for ReduxDialogState: a [open, close] tuple produced by useReduxDialog. */
type ReduxDialogState<_D extends WoveDialogType = WoveDialogType> = [
    (args?: Record<string, unknown>) => void,
    () => void,
];
/** Opaque replacement for CorePropertyHolder — actual instances are passed as-is. */
type CorePropertyHolder = unknown;

const defaultOnUnitOutputRequest = (_u: any) => undefined;
const defaultOnMaterialSwitch = (_index: number) => undefined;

export type UnitsFlowchartContainerProps = {
    units: any[];
    unitIndex: number;
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void;
    onUnitAdd: (
        unitType: DefaultSubworkflowUnitType,
        prepend: boolean,
        insertAtIndex: number,
    ) => void;
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

export default function UnitsFlowchartContainer({
    subworkflow: _subworkflow,
    editable = true,
    adjustable,
    units,
    unitIndex,
    onUnitSelect,
    onUnitAdd,
    onUnitRemove,
    onUnitUpdate,
    onUnitClone,
    isStandalone,
    materials,
    materialsIndex,
    onMaterialSwitch,
    onOutputUpdateRequest,
    publicAccount,
    jobProperties,
    unitTypeReduxDialog,
    UnitModalComponent,
}: UnitsFlowchartContainerProps) {
    const [areUnitsExpanded, setAreUnitsExpanded] = useState(true);
    const [autoFitToView, setAutoFitToView] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [unitModalFlowchartId, setUnitModalFlowchartId] = useState<string | null>(null);
    const flowchartUnits = useMemo(() => units.map((unit) => unit.toJSON()), [units]);

    const handleBlur = () => setIsFocused(false);
    const handleFocus = () => setIsFocused(true);

    const [openUnitTypeSelectDialog, closeUnitTypeSelectDialog] = unitTypeReduxDialog;

    const openUnitTypeSelectDialogIfEditable = () => {
        if (editable) {
            openUnitTypeSelectDialog({
                id: "subworkflow-unit-add-modal",
                onClose: closeUnitTypeSelectDialog,
                onSelect: (unitType, prepend) => {
                    onUnitAdd(unitType, prepend, unitIndex);
                    closeUnitTypeSelectDialog();
                },
                unitTypes: [
                    UnitType.execution,
                    UnitType.assignment,
                    UnitType.condition,
                    UnitType.assertion,
                    UnitType.io,
                ],
            });
        }
    };

    const unitInModal = unitModalFlowchartId
        ? units.find((u) => u.flowchartId === unitModalFlowchartId)
        : undefined;

    useEffect(() => {
        if (unitModalFlowchartId && !unitInModal) {
            setUnitModalFlowchartId(null);
        }
    }, [unitInModal, unitModalFlowchartId]);

    const isUnitRemovable = editable && units.length > 1;

    const getActions = useCallback(
        (unit: AnySubworkflowUnitSchema, index: number): Action[] => {
            const actions: Action[] = [
                {
                    id: `edit-${s.slugify(unit.name)}`,
                    content: !editable ? "View" : "Edit",
                    disabled: false,
                    icon: !editable ? (
                        <IconByName name="actions.preview" />
                    ) : (
                        <IconByName name="actions.edit" />
                    ),
                    onClick: () => {
                        onUnitSelect(unit);
                        setUnitModalFlowchartId(unit.flowchartId);
                    },
                },
                {
                    id: `delete-${s.slugify(unit.name)}`,
                    content: "Delete",
                    disabled: !isUnitRemovable,
                    icon: <IconByName name="actions.delete" />,
                    onClick: () => onUnitRemove(unit.flowchartId),
                },
                {
                    id: `clone-${s.slugify(unit.name)}`,
                    disabled:
                        !editable ||
                        unit.type === UnitType.condition ||
                        unit.type === UnitType.error,
                    content: "Clone",
                    icon: <IconByName name="actions.clone" />,
                    onClick: () => onUnitClone(unit, index + 1),
                },
            ];
            return actions;
        },
        [editable, isUnitRemovable, onUnitRemove, onUnitSelect, onUnitClone],
    );

    const handleHideUnits = () => {
        setAreUnitsExpanded(false);
    };

    const handleExpandUnits = () => {
        setAreUnitsExpanded(true);
    };

    const toggleAutoFitToView = () => {
        setAutoFitToView(!autoFitToView);
    };

    return (
        <ReactFlowProvider>
            {unitInModal && UnitModalComponent && (
                <UnitModalComponent
                    id={`modal-${unitInModal.flowchartId}`}
                    title={`${unitInModal.name}`}
                    className="full-page-overlay full-page-overlay-90-percent edit-workflow"
                    onClose={() => {
                        setUnitModalFlowchartId(null);
                    }}
                    unit={unitInModal}
                    units={units}
                    onUpdate={onUnitUpdate}
                    isStandalone={Boolean(isStandalone)}
                    editable={Boolean(editable)}
                    adjustable={Boolean(adjustable)}
                    onMaterialSwitch={onMaterialSwitch ?? defaultOnMaterialSwitch}
                    materials={materials ?? []}
                    materialsIndex={materialsIndex ?? 0}
                    onOutputUpdateRequest={onOutputUpdateRequest ?? defaultOnUnitOutputRequest}
                    publicAccount={publicAccount}
                    jobProperties={jobProperties}
                />
            )}
            <Paper
                sx={{ height: "100%", display: "flex", flexDirection: "column" }}
                className="subworkflow-units-flowchart">
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{ pl: 2, py: 1 }}>
                    <Typography variant="overline">UNITS</Typography>
                    <UnitsFlowchartDropdown
                        autoFitToView={autoFitToView}
                        toggleAutoFitToView={toggleAutoFitToView}
                        editable={editable}
                        handleAddUnitAction={openUnitTypeSelectDialogIfEditable}
                        areUnitsExpanded={areUnitsExpanded}
                        handleHideUnits={handleHideUnits}
                        handleExpandUnits={handleExpandUnits}
                    />
                </Stack>

                <Divider />

                <Box
                    minHeight="600px"
                    tabIndex={0}
                    flex={1}
                    onFocus={handleFocus}
                    onBlur={handleBlur}>
                    <UnitsFlowchart
                        units={flowchartUnits}
                        areUnitsExpanded={areUnitsExpanded}
                        unitIndex={unitIndex}
                        onUnitSelect={onUnitSelect}
                        getActions={getActions}
                        autoFitToView={autoFitToView}
                        isFocused={isFocused}
                    />
                </Box>
            </Paper>
        </ReactFlowProvider>
    );
}
