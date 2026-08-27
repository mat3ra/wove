import "reactflow/dist/style.css";

import type { Subworkflow, Workflow } from "@mat3ra/wode";
import { UnitType } from "@mat3ra/wode/dist/js/enums";
import type { AnySubworkflowUnitSchema, AnyWorkflowUnit } from "@mat3ra/wode/dist/js/units/factory";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useCallback, useMemo, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { createWorkflowFromConfig, type WorkflowConfigInput } from "../../utils/workflowConfig";
import type { Action } from "../units/types";
import UnitsFlowchart from "../units/UnitsFlowchart";
import { getUnitStatusCls } from "../units/utils";
import { WorkflowUnitsFlowchart } from "./WorkflowUnitsFlowchart";

/** Read-only view: no per-unit actions in the flowchart. Stable so effects don't re-run. */
const NO_ACTIONS: Action[] = [];

export type WorkflowViewerProps = {
    /**
     * The workflow to show: ESSE JSON (a `workflow` or `job` config, or a JSON string of one) as
     * passed in from outside, or a `Workflow` the host app already holds.
     * See {@link createWorkflowFromConfig}.
     */
    workflow: WorkflowConfigInput | Workflow;
    /** Heading for the workflow; defaults to its name. */
    title?: string;
    /** Show the name / unit count / application heading. */
    showHeader?: boolean;
    /** Show the React Flow graph of the selected subworkflow's units. */
    showFlowchart?: boolean;
    /** Height of the flowchart pane — React Flow needs an explicit one. */
    flowchartHeight?: number | string;
    isCardContentExpanded?: boolean;
    /** Enable the cards' Copy action. The viewer is read-only: it wires no remove or update. */
    editable?: boolean;
    /** Called with the workflow unit whose card was clicked. */
    onUnitSelect?: (unit: AnyWorkflowUnit) => void;
    /** Injected by the host app (e.g. @mat3ra/ave's Application); read-only summary by default. */
    ApplicationComponent?: React.ComponentType<any>;
    /** Injected by the host app (e.g. @mat3ra/move's Model); read-only summary by default. */
    ModelComponent?: React.ComponentType<any>;
};

/**
 * Self-contained workflow view driven by JSON from outside this package: the workflow's units as
 * cards, and the units of the selected subworkflow as a flowchart.
 *
 * Needs no store, router or dependency injection — the standalone bundle's `renderWorkflow()`
 * (`src/standalone/index.tsx`) is a thin wrapper around it, and host apps can drop it in as-is.
 */
export function WorkflowViewer({
    workflow,
    title,
    showHeader = true,
    showFlowchart = true,
    flowchartHeight = 520,
    isCardContentExpanded = true,
    editable = false,
    onUnitSelect,
    ApplicationComponent,
    ModelComponent,
}: WorkflowViewerProps) {
    // The config is external input, so building the entity is a fallible step: keep the error to
    // show instead of letting it take the host app's render down with it.
    const [workflowInstance, error] = useMemo<[Workflow | undefined, Error | undefined]>(() => {
        try {
            return [createWorkflowFromConfig(workflow), undefined];
        } catch (caught) {
            return [undefined, caught instanceof Error ? caught : new Error(String(caught))];
        }
    }, [workflow]);

    const units: AnyWorkflowUnit[] = workflowInstance?.unitInstances ?? [];

    const [activeFlowchartId, setActiveFlowchartId] = useState<string | undefined>();
    const [activeSubworkflowUnitId, setActiveSubworkflowUnitId] = useState<string | undefined>();
    const [isFlowchartFocused, setIsFlowchartFocused] = useState(false);

    // Derive the selection from state rather than storing the unit itself, so a new `workflow`
    // falls back to its first unit without an effect resetting things after the first paint.
    const activeUnit = units.find((unit) => unit.flowchartId === activeFlowchartId) ?? units[0];

    const activeSubworkflow: Subworkflow | undefined =
        activeUnit?.type === UnitType.subworkflow
            ? workflowInstance?.subworkflowInstances.find((sw) => sw.id === activeUnit.id)
            : undefined;

    // `UnitsFlowchart` works off unit JSON, not instances (as in `UnitsFlowchartContainer`).
    const subworkflowUnits = useMemo<AnySubworkflowUnitSchema[]>(
        () => (activeSubworkflow?.unitsInstances ?? []).map((unit) => unit.toJSON()),
        [activeSubworkflow],
    );

    const activeSubworkflowUnitIndex = Math.max(
        0,
        subworkflowUnits.findIndex((unit) => unit.flowchartId === activeSubworkflowUnitId),
    );

    // `usedApplications` is the entity's own roll-up: deduplicated, and across nested workflows.
    const applicationLabels = useMemo(
        () =>
            (workflowInstance?.usedApplications ?? [])
                .map((application) =>
                    [application.shortName ?? application.name, application.version]
                        .filter(Boolean)
                        .join(" "),
                )
                .filter(Boolean),
        [workflowInstance],
    );

    const handleUnitClick = useCallback(
        (unit: AnyWorkflowUnit) => {
            setActiveFlowchartId(unit?.flowchartId);
            setActiveSubworkflowUnitId(undefined);
            onUnitSelect?.(unit);
        },
        [onUnitSelect],
    );

    const handleSubworkflowUnitSelect = useCallback((unit: AnySubworkflowUnitSchema) => {
        setActiveSubworkflowUnitId(unit.flowchartId);
    }, []);

    const getActions = useCallback(() => NO_ACTIONS, []);
    const headerStatusCls = useCallback(
        (unit: AnyWorkflowUnit) => getUnitStatusCls(unit?.status),
        [],
    );

    if (error || !workflowInstance) {
        return (
            <Alert severity="error" className="wove-workflow-viewer">
                {error?.message ?? "wove: this workflow could not be read"}
            </Alert>
        );
    }

    return (
        <Stack spacing={2} className="wove-workflow-viewer">
            {showHeader && (
                <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap" useFlexGap>
                    <Typography variant="h6">
                        {title ?? workflowInstance.name ?? "Workflow"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {units.length} {units.length === 1 ? "unit" : "units"}
                    </Typography>
                    {applicationLabels.map((label) => (
                        <Chip key={label} label={label} size="small" variant="outlined" />
                    ))}
                </Stack>
            )}

            {units.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    This workflow has no units to show.
                </Typography>
            ) : (
                <WorkflowUnitsFlowchart
                    workflow={workflowInstance}
                    activeUnit={activeUnit}
                    onClick={handleUnitClick}
                    isCardContentExpanded={isCardContentExpanded}
                    headerStatusCls={headerStatusCls}
                    editable={editable}
                    ApplicationComponent={ApplicationComponent}
                    ModelComponent={ModelComponent}
                />
            )}

            {showFlowchart && subworkflowUnits.length > 0 && (
                <Paper variant="outlined">
                    <Typography variant="overline" sx={{ display: "block", px: 2, py: 1 }}>
                        {activeSubworkflow?.name ?? "Subworkflow"} units
                    </Typography>
                    <Divider />
                    <Box
                        height={flowchartHeight}
                        tabIndex={0}
                        onFocus={() => setIsFlowchartFocused(true)}
                        onBlur={() => setIsFlowchartFocused(false)}>
                        {/* Keyed so switching subworkflows lays out from scratch. */}
                        <ReactFlowProvider key={activeSubworkflow?.id}>
                            <UnitsFlowchart
                                units={subworkflowUnits}
                                areUnitsExpanded
                                unitIndex={activeSubworkflowUnitIndex}
                                onUnitSelect={handleSubworkflowUnitSelect}
                                getActions={getActions}
                                autoFitToView
                                isFocused={isFlowchartFocused}
                            />
                        </ReactFlowProvider>
                    </Box>
                </Paper>
            )}
        </Stack>
    );
}
