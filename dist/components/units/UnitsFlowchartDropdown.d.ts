import React from "react";
interface Props {
    autoFitToView: boolean;
    toggleAutoFitToView: () => void;
    editable: boolean;
    handleAddUnitAction: () => void;
    areUnitsExpanded: boolean;
    handleHideUnits: () => void;
    handleExpandUnits: () => void;
}
declare function UnitsFlowchartDropdown(props: Props): React.JSX.Element;
export default UnitsFlowchartDropdown;
