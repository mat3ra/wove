/**
 * Demo page for the standalone bundle — what `renderWorkflow()` shows when no workflow JSON is
 * passed in (`index.html`). Doubles as the manual test for the JSON entry point: pick a workflow
 * from @mat3ra/standata, or paste any workflow JSON and render it.
 */
import type { WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import { WorkflowStandata } from "@mat3ra/standata";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useMemo, useState } from "react";

import { WorkflowViewer } from "../components/workflows/WorkflowViewer";
import { parseWorkflowConfig } from "../utils/workflowConfig";

export function DemoApp() {
    // The standata catalog type declares only the index fields; the loaded JSONs are workflows.
    const allWorkflows = useMemo<WorkflowSchema[]>(
        () => (new WorkflowStandata().getAll() as unknown as WorkflowSchema[]) ?? [],
        [],
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [pastedJson, setPastedJson] = useState("");
    const [pastedConfig, setPastedConfig] = useState<WorkflowSchema | null>(null);
    const [pasteError, setPasteError] = useState<string | null>(null);

    const workflowConfig = pastedConfig ?? allWorkflows[selectedIndex];

    const renderPastedJson = () => {
        try {
            setPastedConfig(parseWorkflowConfig(pastedJson));
            setPasteError(null);
        } catch (error) {
            setPastedConfig(null);
            setPasteError(error instanceof Error ? error.message : String(error));
        }
    };

    const clearPastedJson = () => {
        setPastedJson("");
        setPastedConfig(null);
        setPasteError(null);
    };

    return (
        <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
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
                    Standalone demo · {allWorkflows.length} workflows from standata. Any page can
                    render its own workflow JSON with{" "}
                    <Box component="code" sx={{ fontFamily: "monospace" }}>
                        window.renderWorkflow(workflowConfig, container)
                    </Box>{" "}
                    — see the{" "}
                    <Link href="https://github.com/mat3ra/wove#readme" underline="hover">
                        README
                    </Link>
                    .
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <FormControl size="small" sx={{ minWidth: 340 }} disabled={Boolean(pastedConfig)}>
                    <InputLabel id="workflow-select-label">Workflow</InputLabel>
                    <Select
                        labelId="workflow-select-label"
                        id="workflow-select"
                        value={selectedIndex}
                        label="Workflow"
                        onChange={(e) => setSelectedIndex(Number(e.target.value))}>
                        {allWorkflows.map((workflow, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <MenuItem key={index} value={index}>
                                {workflow.name ?? `Workflow ${index + 1}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                    <Typography variant="overline" color="text.secondary">
                        Render workflow JSON
                    </Typography>
                    <TextField
                        id="workflow-json-input"
                        label="Workflow JSON"
                        placeholder='{"name": "My workflow", "units": [...], "subworkflows": [...]}'
                        multiline
                        minRows={3}
                        maxRows={10}
                        size="small"
                        value={pastedJson}
                        onChange={(e) => setPastedJson(e.target.value)}
                        InputProps={{ sx: { fontFamily: "monospace", fontSize: "0.75rem" } }}
                    />
                    {pasteError && <Alert severity="error">{pasteError}</Alert>}
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!pastedJson.trim()}
                            onClick={renderPastedJson}>
                            Render
                        </Button>
                        <Button
                            size="small"
                            disabled={!pastedJson && !pastedConfig}
                            onClick={clearPastedJson}>
                            Clear
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Divider />

            {workflowConfig ? (
                <WorkflowViewer workflow={workflowConfig} />
            ) : (
                <Typography color="text.secondary">No workflows found in standata.</Typography>
            )}
        </Stack>
    );
}
