import { jsx as _jsx } from "react/jsx-runtime";
import Accordion from "@mat3ra/cove.js/dist/mui/components/accordion";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { UnitCard } from "./UnitCard";
export function UnitsAccordion({ units }) {
    return (_jsx(Accordion, { header: "Units", isExpanded: false, children: _jsx(Grid2, { container: true, spacing: 2, children: units.map((unit, index) => (_jsx(Grid2, { xs: 12, children: _jsx(UnitCard, { index: index + 1, unit: unit }) }, unit.flowchartId))) }) }));
}
