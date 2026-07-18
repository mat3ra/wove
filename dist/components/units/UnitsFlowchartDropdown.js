import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Dropdown from "@mat3ra/cove.js/dist/mui/components/dropdown";
import IconByName from "@mat3ra/cove.js/dist/mui/components/icon";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import InfoPopover from "@mat3ra/cove.js/dist/mui/components/popover/info-popover/InfoPopover";
const UnitTypeTitle = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    margin: theme.spacing(1, 0),
}));
const UnitTypeBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});
const UnitType = styled(Typography)(({ theme, unitType }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(0.5),
    "&:before": {
        display: "block",
        content: '""',
        width: "18px",
        height: "18px",
        backgroundColor: theme.palette.unitTypes[unitType],
        marginRight: theme.spacing(1),
    },
}));
function UnitsFlowchartDropdown(props) {
    const { autoFitToView, toggleAutoFitToView, editable, handleAddUnitAction, areUnitsExpanded, handleHideUnits, handleExpandUnits, } = props;
    const getDropdownAction = () => {
        return [
            {
                isShown: editable,
                icon: _jsx(IconByName, { name: "shapes.addCircle" }),
                content: "Add Unit",
                onClick: handleAddUnitAction,
                id: "add-unit",
                key: "add-unit",
            },
            {
                isDivider: true,
                isShown: editable,
                key: "divider",
                id: "divider",
                onClick: () => undefined,
                content: "",
            },
            {
                isShown: true,
                icon: areUnitsExpanded ? (_jsx(IconByName, { name: "actions.collapse" })) : (_jsx(IconByName, { name: "actions.expand" })),
                content: areUnitsExpanded ? "Collapse units" : "Expand units",
                onClick: areUnitsExpanded ? handleHideUnits : handleExpandUnits,
                id: areUnitsExpanded ? "collapse" : "expand",
                key: "expand-collapse",
            },
        ];
    };
    return (_jsxs(Stack, { direction: "row", alignItems: "center", children: [_jsx(Typography, { variant: "body2", align: "center", children: "Auto fit" }), _jsx(Switch, { id: "auto-fit-flowchart-view", checked: autoFitToView, size: "medium", onClick: () => toggleAutoFitToView() }), _jsx(Dropdown, { id: "unit-actions-dropdown", actions: getDropdownAction(), buttonContent: "Select Unit Actions" }), _jsx("ul", { className: "actions", children: _jsx("li", { children: _jsxs(InfoPopover, { title: "Subworkflow", children: ["This is a graphical representation of the subworkflow units.", _jsx(UnitTypeTitle, { variant: "body2", color: "text.primary", children: "Unit Types" }), _jsxs(UnitTypeBox, { children: [_jsx(UnitType, { variant: "caption", color: "text.primary", unitType: "execution", children: "Execution" }), _jsx(UnitType, { variant: "caption", color: "text.primary", unitType: "condition", children: "Condition" }), _jsx(UnitType, { variant: "caption", color: "text.primary", unitType: "assignment", children: "Assignment" }), _jsx(UnitType, { variant: "caption", color: "text.primary", unitType: "assertion", children: "Assertion" })] }), _jsx("br", {}), _jsx(Link, { href: "https://docs.mat3ra.com/workflow-designer/subworkflow-editor/units-flowchart/#unit-types", target: "_blank", underline: "hover", children: "Documentation is here" })] }) }) })] }));
}
export default UnitsFlowchartDropdown;
