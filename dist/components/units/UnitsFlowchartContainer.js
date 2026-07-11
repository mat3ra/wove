import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "reactflow/dist/style.css";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import s from "underscore.string";
import UnitsFlowchart from "./UnitsFlowchart";
import UnitsFlowchartDropdown from "./UnitsFlowchartDropdown";
const defaultOnUnitOutputRequest = (_u) => undefined;
const defaultOnMaterialSwitch = (_index) => undefined;
export default function UnitsFlowchartContainer({ subworkflow: _subworkflow, editable = true, adjustable, units, unitIndex, onUnitSelect, onUnitAdd, onUnitRemove, onUnitUpdate, onUnitClone, isStandalone, materials, materialsIndex, onMaterialSwitch, onOutputUpdateRequest, publicAccount, jobProperties, unitTypeReduxDialog, UnitModalComponent, }) {
    const [areUnitsExpanded, setAreUnitsExpanded] = useState(true);
    const [autoFitToView, setAutoFitToView] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [unitModalFlowchartId, setUnitModalFlowchartId] = useState(null);
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
    const getActions = useCallback((unit, index) => {
        const actions = [
            {
                id: `edit-${s.slugify(unit.name)}`,
                content: !editable ? "View" : "Edit",
                disabled: false,
                icon: !editable ? (_jsx(IconByName, { name: "actions.preview" })) : (_jsx(IconByName, { name: "actions.edit" })),
                onClick: () => {
                    onUnitSelect(unit);
                    setUnitModalFlowchartId(unit.flowchartId);
                },
            },
            {
                id: `delete-${s.slugify(unit.name)}`,
                content: "Delete",
                disabled: !isUnitRemovable,
                icon: _jsx(IconByName, { name: "actions.delete" }),
                onClick: () => onUnitRemove(unit.flowchartId),
            },
            {
                id: `clone-${s.slugify(unit.name)}`,
                disabled: !editable ||
                    unit.type === UnitType.condition ||
                    unit.type === UnitType.error,
                content: "Clone",
                icon: _jsx(IconByName, { name: "actions.clone" }),
                onClick: () => onUnitClone(unit, index + 1),
            },
        ];
        return actions;
    }, [editable, isUnitRemovable, onUnitRemove, onUnitSelect, onUnitClone]);
    const handleHideUnits = () => {
        setAreUnitsExpanded(false);
    };
    const handleExpandUnits = () => {
        setAreUnitsExpanded(true);
    };
    const toggleAutoFitToView = () => {
        setAutoFitToView(!autoFitToView);
    };
    return (_jsxs(ReactFlowProvider, { children: [unitInModal && UnitModalComponent && (_jsx(UnitModalComponent, { id: `modal-${unitInModal.flowchartId}`, title: `${unitInModal.name}`, className: "full-page-overlay full-page-overlay-90-percent edit-workflow", onClose: () => {
                    setUnitModalFlowchartId(null);
                }, unit: unitInModal, units: units, onUpdate: onUnitUpdate, isStandalone: Boolean(isStandalone), editable: Boolean(editable), adjustable: Boolean(adjustable), onMaterialSwitch: onMaterialSwitch !== null && onMaterialSwitch !== void 0 ? onMaterialSwitch : defaultOnMaterialSwitch, materials: materials !== null && materials !== void 0 ? materials : [], materialsIndex: materialsIndex !== null && materialsIndex !== void 0 ? materialsIndex : 0, onOutputUpdateRequest: onOutputUpdateRequest !== null && onOutputUpdateRequest !== void 0 ? onOutputUpdateRequest : defaultOnUnitOutputRequest, publicAccount: publicAccount, jobProperties: jobProperties })), _jsxs(Paper, { sx: { height: "100%", display: "flex", flexDirection: "column" }, className: "subworkflow-units-flowchart", children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "flex-end", sx: { pl: 2, py: 1 }, children: [_jsx(Typography, { variant: "overline", children: "UNITS" }), _jsx(UnitsFlowchartDropdown, { autoFitToView: autoFitToView, toggleAutoFitToView: toggleAutoFitToView, editable: editable, handleAddUnitAction: openUnitTypeSelectDialogIfEditable, areUnitsExpanded: areUnitsExpanded, handleHideUnits: handleHideUnits, handleExpandUnits: handleExpandUnits })] }), _jsx(Divider, {}), _jsx(Box, { minHeight: "600px", tabIndex: 0, flex: 1, onFocus: handleFocus, onBlur: handleBlur, children: _jsx(UnitsFlowchart, { units: flowchartUnits, areUnitsExpanded: areUnitsExpanded, unitIndex: unitIndex, onUnitSelect: onUnitSelect, getActions: getActions, autoFitToView: autoFitToView, isFocused: isFocused }) })] })] }));
}
