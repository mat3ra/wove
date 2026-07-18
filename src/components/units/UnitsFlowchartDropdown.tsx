import Dropdown from "@mat3ra/cove.js/dist/mui/components/dropdown";
import IconByName from "@mat3ra/cove.js/dist/mui/components/icon";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import React from "react";

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

const UnitType = styled(Typography)<{ unitType: string }>(({ theme, unitType }: any) => ({
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(0.5),

    "&:before": {
        display: "block",
        content: '""',
        width: "18px",
        height: "18px",
        backgroundColor: (theme.palette as any).unitTypes[unitType],
        marginRight: theme.spacing(1),
    },
}));

interface Props {
    autoFitToView: boolean;
    toggleAutoFitToView: () => void;
    editable: boolean;
    handleAddUnitAction: () => void;
    areUnitsExpanded: boolean;
    handleHideUnits: () => void;
    handleExpandUnits: () => void;
}

function UnitsFlowchartDropdown(props: Props) {
    const {
        autoFitToView,
        toggleAutoFitToView,
        editable,
        handleAddUnitAction,
        areUnitsExpanded,
        handleHideUnits,
        handleExpandUnits,
    } = props;

    const getDropdownAction = () => {
        return [
            {
                isShown: editable,
                icon: <IconByName name="shapes.addCircle" />,
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
                icon: areUnitsExpanded ? (
                    <IconByName name="actions.collapse" />
                ) : (
                    <IconByName name="actions.expand" />
                ),
                content: areUnitsExpanded ? "Collapse units" : "Expand units",
                onClick: areUnitsExpanded ? handleHideUnits : handleExpandUnits,
                id: areUnitsExpanded ? "collapse" : "expand",
                key: "expand-collapse",
            },
        ];
    };

    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" align="center">
                Auto fit
            </Typography>
            <Switch
                id="auto-fit-flowchart-view"
                checked={autoFitToView}
                size="medium"
                onClick={() => toggleAutoFitToView()}
            />
            <Dropdown
                id="unit-actions-dropdown"
                actions={getDropdownAction()}
                buttonContent="Select Unit Actions"
            />
            <ul className="actions">
                <li>
                    <InfoPopover
                        title="Subworkflow">

                        This is a graphical representation of the subworkflow units.
                        <UnitTypeTitle variant="body2" color="text.primary">
                            Unit Types
                        </UnitTypeTitle>
                        <UnitTypeBox>
                            <UnitType variant="caption" color="text.primary" unitType="execution">
                                Execution
                            </UnitType>
                            <UnitType variant="caption" color="text.primary" unitType="condition">
                                Condition
                            </UnitType>
                            <UnitType variant="caption" color="text.primary" unitType="assignment">
                                Assignment
                            </UnitType>
                            <UnitType variant="caption" color="text.primary" unitType="assertion">
                                Assertion
                            </UnitType>
                        </UnitTypeBox>
                        <br />
                        <Link
                            href="https://docs.mat3ra.com/workflow-designer/subworkflow-editor/units-flowchart/#unit-types"
                            target="_blank"
                            underline="hover">
                            Documentation is here
                        </Link>
                    </InfoPopover>
                </li>
            </ul>
        </Stack>
    );
}

export default UnitsFlowchartDropdown;
