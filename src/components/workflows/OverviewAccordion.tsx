import Accordion from "@exabyte-io/cove.js/dist/mui/components/accordion";
const AccordionComponent = Accordion as any;
import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Model as ModeModel } from "@mat3ra/mode";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import Grid from "@mui/material/Grid";
import React from "react";

import { Properties } from "../subworkflows/Properties";

import { Application as AveApplication } from "@mat3ra/ave";
import { Model } from "@mat3ra/move";

const noopSubworkflowSchema = (): undefined => undefined;

export type OverviewAccordionProps = {
    isSubworkflowOverview?: boolean;
    isExpanded?: boolean;
    subworkflow: WodeSubworkflow;
    editable?: boolean;
    onUpdate?: (subworkflow: SubworkflowSchema) => void;
    onApplicationUpdate?: (...args: unknown[]) => void;
    onModelUpdate?: (model: ModeModel) => void;
};

export function OverviewAccordion({
    isSubworkflowOverview = false,
    isExpanded,
    subworkflow,
    editable = false,
    onUpdate = noopSubworkflowSchema as (sw: SubworkflowSchema) => void,
    onApplicationUpdate = () => undefined,
    onModelUpdate = () => undefined,
}: OverviewAccordionProps) {
    const isModelAndMethodDataShown =
        (!subworkflow.modelInstance.isUnknown || editable) && !isSubworkflowOverview;

    return (
        <AccordionComponent
            id="subworkflow-overview-accordion"
            elevation={0}
            defaultExpanded={isExpanded}
            expanded={isExpanded}
            disableGutters
            header="Overview">
            <Grid container direction="row">
                <Properties subworkflow={subworkflow} onUpdate={onUpdate} editable={false} />
                <AveApplication
                    application={subworkflow.application}
                    onApplicationUpdate={onApplicationUpdate}
                    editable={false}
                />
                {isModelAndMethodDataShown && (
                    <Model
                        model={subworkflow.modelInstance}
                        application={subworkflow.application}
                        onUpdate={onModelUpdate}
                        editable={false}
                    />
                )}
            </Grid>
        </AccordionComponent>
    );
}
