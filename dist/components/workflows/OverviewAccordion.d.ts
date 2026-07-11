import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Model as ModeModel } from "@mat3ra/mode";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import React, { type ComponentType } from "react";
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
export declare function OverviewAccordion({ isSubworkflowOverview, isExpanded, subworkflow, editable, onUpdate, onApplicationUpdate, onModelUpdate, ApplicationComponent, ModelComponent, }: OverviewAccordionProps): React.JSX.Element;
export {};
