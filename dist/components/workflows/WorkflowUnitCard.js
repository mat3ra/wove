import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCopyToClipboard } from "@mat3ra/cove/dist/hooks/useCopyToClipboard";
import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import Code from "@mat3ra/code";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { useCallback, useMemo } from "react";
import s from "underscore.string";
import { UnitsAccordion } from "../units/UnitsAccordion";
import { OverviewAccordion } from "./OverviewAccordion";
import { CardFooter } from "../common/CardFooter";
import { CardHeader } from "../common/CardHeader";
export function WorkflowUnitCard({ index, unit, isSelected = false, onClick, isRemovable = false, onRemove, subworkflow, isCardContentExpanded = true, editable = false, showDeveloperInfo = false, showStatus = true, headerStatusCls, onUpdate, onApplicationUpdate, onModelUpdate, ApplicationComponent, ModelComponent, }) {
    var _a;
    const theme = useTheme();
    const copyToClipboard = useCopyToClipboard();
    const contentToCopy = useMemo(() => ((subworkflow === null || subworkflow === void 0 ? void 0 : subworkflow._json) ? JSON.stringify(subworkflow._json, null, 4) : unit.flowchartId), [subworkflow, unit.flowchartId]);
    const actions = useMemo(() => [
        {
            id: `copy-${s.slugify(unit.name)}`,
            // Copying the subworkflow (for paste into another workflow) is an editing
            // affordance - disabled on read-only views, e.g. a finished job's workflow tab.
            disabled: !editable,
            content: "Copy",
            icon: _jsx(IconByName, { name: "actions.copy" }),
            onClick: () => {
                copyToClipboard(contentToCopy, `Unit '${unit.name}' was successfully copied`);
            },
        },
        {
            id: `delete-${s.slugify(unit.name)}`,
            content: "Delete",
            disabled: !isRemovable,
            icon: _jsx(IconByName, { name: "actions.delete" }),
            onClick: () => onRemove(unit.flowchartId),
        },
    ], [
        unit.name,
        unit.flowchartId,
        contentToCopy,
        copyToClipboard,
        isRemovable,
        onRemove,
        editable,
    ]);
    const onCardClick = useCallback((e) => {
        // Accordion summary clicks preventDefault() (cove's Accordion marks the expansion
        // toggle as handled) and must NOT move the selection: the Cypress job-designer step
        // "I open {tab} tab of job designer" bulk-clicks every card's Overview accordion
        // (toggleSubworkflowOverview, {multiple: true}) and relies on the selection staying
        // put. Selection-on-center-click instead relies on CardHeader keeping the
        // pre-extraction 73px height so the card's midpoint falls on the neutral CardFooter
        // strip - see CardHeader.tsx.
        if (!e.defaultPrevented)
            onClick(unit);
    }, [onClick, unit]);
    const avatarIndex = Code.utils.convertArabicToRoman(index);
    const borderColor = isSelected ? theme.palette.primary.main : "transparent";
    const badgeColor = headerStatusCls(unit);
    const nestedUnits = subworkflow === null || subworkflow === void 0 ? void 0 : subworkflow.unitsInstances;
    return (_jsx(Card, { id: `workflow-card-unit-${s.slugify(unit.name)}`, onClick: onCardClick, sx: { width: "100%", minWidth: "280px", cursor: "pointer" }, children: _jsxs(Box, { sx: { border: `4px solid ${borderColor}` }, children: [_jsx(CardHeader, { avatarType: "roman", avatarIndex: avatarIndex, badgeColor: badgeColor, title: unit.name, status: (_a = unit.status) !== null && _a !== void 0 ? _a : "", subheader: unit.flowchartId, actions: actions, isExpanded: isCardContentExpanded, contentToCopy: contentToCopy, showDeveloperInfo: showDeveloperInfo, showStatus: showStatus }), isCardContentExpanded && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(CardFooter, { justifyContent: "space-around", actions: actions })] })), _jsx(Divider, {}), subworkflow ? (_jsx(OverviewAccordion, { isSubworkflowOverview: true, editable: editable, subworkflow: subworkflow, onUpdate: onUpdate, onApplicationUpdate: onApplicationUpdate, onModelUpdate: onModelUpdate, ApplicationComponent: ApplicationComponent, ModelComponent: ModelComponent })) : null, Boolean(nestedUnits === null || nestedUnits === void 0 ? void 0 : nestedUnits.length) && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(UnitsAccordion, { units: nestedUnits !== null && nestedUnits !== void 0 ? nestedUnits : [] })] }))] }) }));
}
