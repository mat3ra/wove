import Accordion from "@mat3ra/cove/dist/mui/components/accordion";
import type { AnySubworkflowUnit } from "@mat3ra/wode/dist/js/units/factory";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

import { UnitCard } from "./UnitCard";

export type UnitsAccordionProps = {
    units: readonly AnySubworkflowUnit[];
};

export function UnitsAccordion({ units }: UnitsAccordionProps) {
    return (
        <Accordion header="Units" isExpanded={false}>
            <Grid2 container spacing={2}>
                {units.map((unit: any, index) => (
                    <Grid2 xs={12} key={unit.flowchartId}>
                        <UnitCard index={index + 1} unit={unit} />
                    </Grid2>
                ))}
            </Grid2>
        </Accordion>
    );
}
