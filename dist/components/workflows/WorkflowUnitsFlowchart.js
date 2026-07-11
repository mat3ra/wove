import { jsx as _jsx } from "react/jsx-runtime";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import Box from "@mui/material/Box";
import { useCallback } from "react";
import { WorkflowUnitCard } from "./WorkflowUnitCard";
export function WorkflowUnitsFlowchart({ workflow, activeUnit, onClick, isCardContentExpanded, headerStatusCls, editable = false, onUnitRemove, onSubworkflowUnitUpdate, ApplicationComponent, ModelComponent, }) {
    const renderUnit = useCallback((unit, index, sw) => {
        return (_jsx(Box, { sx: { mt: index ? 2 : 0 }, children: _jsx(WorkflowUnitCard, { headerStatusCls: headerStatusCls, editable: editable, subworkflow: sw !== null && sw !== void 0 ? sw : undefined, onUpdate: onSubworkflowUnitUpdate, onRemove: onUnitRemove !== null && onUnitRemove !== void 0 ? onUnitRemove : (() => undefined), isRemovable: editable, index: index + 1, unit: unit, isSelected: unit.flowchartId === activeUnit.flowchartId, onClick: onClick, isCardContentExpanded: isCardContentExpanded, ApplicationComponent: ApplicationComponent, ModelComponent: ModelComponent }) }, unit.flowchartId));
    }, [
        headerStatusCls,
        editable,
        onSubworkflowUnitUpdate,
        onUnitRemove,
        activeUnit.flowchartId,
        onClick,
        isCardContentExpanded,
        ApplicationComponent,
        ModelComponent,
    ]);
    const elements = [];
    workflow.unitInstances.forEach((unitUntyped, i) => {
        var _a;
        const unit = unitUntyped;
        let sw = null;
        if (unit.type === UnitType.subworkflow) {
            sw = (_a = workflow.subworkflowInstances.find((s) => s.id === unit.id)) !== null && _a !== void 0 ? _a : null;
            if (sw) {
                unit.name = sw.name;
            }
        }
        elements.push(renderUnit(unit, i, sw));
    });
    return _jsx("div", { className: "card-body", children: elements });
}
