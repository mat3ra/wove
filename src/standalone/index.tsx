/**
 * Wove standalone bundle — entry point.
 *
 * Exposes `window.renderWorkflow(workflowConfig, domElement, options)` so any page can show a
 * workflow from JSON it already has, without bundling wove itself. Same contract as wave.js'
 * `window.renderThreeDEditor(materialConfig, domElement)`, which is how the Jupyter helpers in
 * mat3ra/api-examples (`get_viewer_js`) embed a viewer:
 *
 *     const workflowConfig = {...};                       // e.g. json.loads(workflow.to_json())
 *     const container = document.getElementById('wove-1');
 *     (async function () {
 *         await import('https://mat3ra.github.io/wove/main.js');
 *         window.renderWorkflow(workflowConfig, container);
 *     })();
 *
 * Called with no config (as `index.html` does) it renders the standata-backed demo instead.
 */
import "./bootstrap";

import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";

import { WorkflowViewer, type WorkflowViewerProps } from "../components/workflows/WorkflowViewer";
import type { WorkflowConfigInput } from "../utils/workflowConfig";
import { DemoApp } from "./DemoApp";
import { createWoveTheme, type ThemeMode } from "./theme";

export type RenderWorkflowOptions = Pick<
    WorkflowViewerProps,
    | "title"
    | "showHeader"
    | "showFlowchart"
    | "flowchartHeight"
    | "isCardContentExpanded"
    | "editable"
    | "onUnitSelect"
> & {
    /** Palette mode for the bundled theme. Defaults to `"dark"`. */
    themeMode?: ThemeMode;
};

/**
 * Render a workflow into a DOM element from its JSON.
 *
 * @param workflowConfig workflow config object (or JSON string of one; a job config works too).
 *      Omit it to render the demo.
 * @param newDomElement container to render into; defaults to `#root`.
 * @param options see {@link RenderWorkflowOptions}.
 */
export const renderWorkflow = (
    workflowConfig?: WorkflowConfigInput,
    newDomElement?: HTMLElement | null,
    options: RenderWorkflowOptions = {},
) => {
    const domElement = newDomElement || document.getElementById("root");
    if (!domElement) {
        // eslint-disable-next-line no-console
        console.warn("wove: no root element found for rendering the workflow");
        return;
    }

    const { themeMode = "dark", ...viewerOptions } = options;

    ReactDOM.render(
        <ThemeProvider theme={createWoveTheme(themeMode)}>
            {/* Scoped, not global: the container is often one cell of a larger page. */}
            <ScopedCssBaseline
                sx={{ height: "100%", overflow: "auto", p: 2, bgcolor: "background.default" }}>
                {workflowConfig ? (
                    <WorkflowViewer workflow={workflowConfig} {...viewerOptions} />
                ) : (
                    <DemoApp />
                )}
            </ScopedCssBaseline>
        </ThemeProvider>,
        domElement,
    );
};

declare global {
    interface Window {
        renderWorkflow: typeof renderWorkflow;
    }
}

window.renderWorkflow = renderWorkflow;
