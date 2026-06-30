/**
 * Wove standalone demo — viewer-only.
 *
 * Loads real workflows from @mat3ra/standata and renders WorkflowUnitsFlowchart.
 * No Meteor, no Redux, no setDependencies().
 */
import "reactflow/dist/style.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";

import { WorkflowUnitsFlowchart } from "../components/workflows/WorkflowUnitsFlowchart";
import { ApplicationRegistry, WorkflowStandata } from "@mat3ra/standata";
import { ApplicationDriver } from "@mat3ra/standata/dist/js/ApplicationDriver";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";

// ---------------------------------------------------------------------------
// Bootstrap — must happen before any component mounts.
// 1. Register all ESSE schemas so JSONSchemasInterface lookups work.
// 2. Set the ApplicationRegistry driver so getExecutablesByApplication() works.
// ---------------------------------------------------------------------------
JSONSchemasInterface.setSchemas(esseSchemas);
ApplicationRegistry.setDriver(new ApplicationDriver());

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const demoTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#7c4dff" },
        secondary: { main: "#00e5ff" },
        background: {
            default: "#0d1117",
            paper: "#161b22",
        },
    },
});

// ---------------------------------------------------------------------------
// Adapters — convert raw standata JSON to the shape wove components expect.
// Avoids wode class instantiation (which triggers ESSE schema validation).
//
// Key link: in standata workflow JSON, units[i]._id === subworkflows[i]._id
// so that WorkflowUnitsFlowchart.find(s => s.id === unit.id) works.
// ---------------------------------------------------------------------------

/**
 * Adapt a raw standata subworkflow object to the shape expected by
 * WorkflowUnitCard / OverviewAccordion / Properties.
 */
function adaptSubworkflow(sw: any) {
    const model = sw.model ?? {};
    return {
        _json: sw,
        id: sw._id,
        name: sw.name ?? "Subworkflow",
        application: sw.application ?? {},
        model,
        method: sw.method ?? {},
        // Properties.tsx calls subworkflow.properties.map()
        properties: sw.properties ?? [],
        // OverviewAccordion reads modelInstance.isUnknown
        modelInstance: {
            isUnknown: !model.type,
            ...model,
            prop: (_key: string) => undefined,
            toJSON: () => model,
        },
        // WorkflowUnitCard reads subworkflow.unitsInstances for UnitsAccordion
        unitsInstances: (sw.units ?? []).map((u: any) => ({ ...u, id: u._id })),
        toJSON: () => sw,
    };
}

/**
 * Adapt a raw standata workflow JSON to the shape expected by
 * WorkflowUnitsFlowchart: { unitInstances, subworkflowInstances }.
 */
function adaptWorkflow(wfJson: any) {
    const subworkflowInstances = (wfJson.subworkflows ?? []).map(adaptSubworkflow);
    const unitInstances = (wfJson.units ?? []).map((unit: any) => ({
        ...unit,
        id: unit._id,
        status: unit.status ?? "idle",
        toJSON: () => unit,
    }));
    return { unitInstances, subworkflowInstances };
}

// ---------------------------------------------------------------------------
// Demo App
// ---------------------------------------------------------------------------

function App() {
    const workflowStandata = useMemo(() => new WorkflowStandata(), []);
    const allWorkflows: any[] = useMemo(() => workflowStandata.getAll() ?? [], [workflowStandata]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeUnit, setActiveUnit] = useState<any>(null);

    const selectedWorkflowJson = allWorkflows[selectedIndex];
    const adaptedWorkflow = useMemo(
        () => (selectedWorkflowJson ? adaptWorkflow(selectedWorkflowJson) : null),
        [selectedWorkflowJson],
    );

    // Reset active unit when workflow changes
    React.useEffect(() => {
        setActiveUnit(adaptedWorkflow?.unitInstances?.[0] ?? null);
    }, [adaptedWorkflow]);

    const headerStatusCls = (unit: any): string => {
        const colorMap: Record<string, string> = {
            idle: "default",
            active: "warning",
            warning: "warning",
            error: "error",
            finished: "success",
            succeeded: "success",
        };
        return colorMap[unit.status ?? "idle"] ?? "default";
    };

    const applicationName = selectedWorkflowJson?.application?.name;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                py: 4,
            }}>
            <Container maxWidth="md">
                <Stack spacing={3}>
                    {/* Header */}
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                background: "linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 0.5,
                            }}>
                            Wove — Workflow Viewer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Standalone demo · {allWorkflows.length} workflows from standata
                        </Typography>
                    </Box>

                    {/* Workflow selector */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 340 }}>
                            <InputLabel id="workflow-select-label">Workflow</InputLabel>
                            <Select
                                labelId="workflow-select-label"
                                id="workflow-select"
                                value={selectedIndex}
                                label="Workflow"
                                onChange={(e) => setSelectedIndex(Number(e.target.value))}>
                                {allWorkflows.map((wf: any, i: number) => (
                                    <MenuItem key={i} value={i}>
                                        {wf.name ?? `Workflow ${i + 1}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {applicationName && (
                            <Chip
                                label={applicationName}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                        )}
                    </Stack>

                    <Divider />

                    {/* WorkflowUnitsFlowchart */}
                    {adaptedWorkflow ? (
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}>
                            <Typography variant="overline" color="text.secondary" mb={1} display="block">
                                Workflow Units
                            </Typography>
                            <WorkflowUnitsFlowchart
                                workflow={adaptedWorkflow}
                                activeUnit={activeUnit ?? {}}
                                onClick={(unit: any) => setActiveUnit(unit)}
                                isCardContentExpanded
                                headerStatusCls={headerStatusCls}
                                editable={false}
                            />
                        </Paper>
                    ) : (
                        <Typography color="text.secondary">No workflows found in standata.</Typography>
                    )}

                    {/* Selected unit detail */}
                    {activeUnit && (
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "primary.main",
                                borderRadius: 2,
                            }}>
                            <Typography variant="overline" color="primary" mb={1} display="block">
                                Selected Unit
                            </Typography>
                            <pre
                                style={{
                                    fontSize: "0.75rem",
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-all",
                                }}>
                                {JSON.stringify(
                                    typeof activeUnit.toJSON === "function"
                                        ? activeUnit.toJSON()
                                        : activeUnit,
                                    null,
                                    2,
                                )}
                            </pre>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.render(
        <React.StrictMode>
            <ThemeProvider theme={demoTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </React.StrictMode>,
        rootElement,
    );
}
