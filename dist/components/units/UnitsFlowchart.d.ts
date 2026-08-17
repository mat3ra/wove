import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import React from "react";
import { Action } from "./types";
interface Props {
    units: AnySubworkflowUnitSchema[];
    areUnitsExpanded: boolean;
    unitIndex: number;
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void;
    getActions: (unit: AnySubworkflowUnitSchema, index: number) => Action[];
    autoFitToView: boolean;
    isFocused: boolean;
    showDeveloperInfo?: boolean;
    showStatus?: boolean;
}
declare function UnitsFlowchart(props: Props): React.JSX.Element;
export default UnitsFlowchart;
