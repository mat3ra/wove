import Accordion from "@mat3ra/cove/dist/mui/components/accordion";
const AccordionComponent = Accordion as any;
import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Model as ModeModel } from "@mat3ra/mode";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import Grid from "@mui/material/Grid";
import React, { type ComponentType } from "react";

import { Properties } from "../subworkflows/Properties";

const noopSubworkflowSchema = (): undefined => undefined;

// ---------------------------------------------------------------------------
// Injection points.
//
// The rich Application/Model editors live in sibling packages (@mat3ra/ave's
// <Application>, @mat3ra/move's <Model>) and pull heavy transitive deps
// (rjsf, simpl-schema, @mat3ra/mode). wove does NOT depend on them directly —
// the host app passes them in via ApplicationComponent / ModelComponent, and
// wove falls back to the read-only package-native defaults below. This keeps
// the standalone bundle free of those deps while the webapp injects the full
// editors.
// ---------------------------------------------------------------------------

type ApplicationComponentProps = {
    application: unknown;
    onApplicationUpdate?: (...args: unknown[]) => void;
    editable?: boolean;
};

type ModelComponentProps = {
    model: unknown;
    application: unknown;
    onUpdate?: (model: ModeModel) => void;
    editable?: boolean;
};

function DefaultApplication({ application }: ApplicationComponentProps) {
    const app = application as { name?: string; version?: string; build?: string } | undefined;
    if (!app) return null;
    const label = [app.name, app.version, app.build].filter(Boolean).join(" ");
    return (
        <Grid item xs={12} className="wove-default-application">
            <strong>Application:</strong> {label || "unknown"}
        </Grid>
    );
}

function DefaultModel({ model }: ModelComponentProps) {
    const m = model as { name?: string; method?: { name?: string } } | undefined;
    if (!m) return null;
    const label = m.name ?? m.method?.name ?? "unknown";
    return (
        <Grid item xs={12} className="wove-default-model">
            <strong>Model:</strong> {label}
        </Grid>
    );
}

export type OverviewAccordionProps = {
    isSubworkflowOverview?: boolean;
    isExpanded?: boolean;
    subworkflow: WodeSubworkflow;
    editable?: boolean;
    onUpdate?: (subworkflow: SubworkflowSchema) => void;
    onApplicationUpdate?: (...args: unknown[]) => void;
    onModelUpdate?: (model: ModeModel) => void;
    /** Injected by the host app (e.g. @mat3ra/ave's Application). Defaults to a read-only summary. */
    ApplicationComponent?: ComponentType<ApplicationComponentProps>;
    /** Injected by the host app (e.g. @mat3ra/move's Model). Defaults to a read-only summary. */
    ModelComponent?: ComponentType<ModelComponentProps>;
};

export function OverviewAccordion({
    isSubworkflowOverview = false,
    isExpanded,
    subworkflow,
    editable = false,
    onUpdate = noopSubworkflowSchema as (sw: SubworkflowSchema) => void,
    onApplicationUpdate = () => undefined,
    onModelUpdate = () => undefined,
    ApplicationComponent = DefaultApplication,
    ModelComponent = DefaultModel,
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
                <ApplicationComponent
                    application={subworkflow.application}
                    onApplicationUpdate={onApplicationUpdate}
                    editable={false}
                />
                {isModelAndMethodDataShown && (
                    <ModelComponent
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
