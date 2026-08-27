[![npm version](https://badge.fury.io/js/%40mat3ra%2Fwove.svg)](https://badge.fury.io/js/%40mat3ra%2Fwove)
[![License: Apache](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# Wove

Workflow Viewer components.

## Installation

```bash
npm install @mat3ra/wove
```

## Show a workflow from JSON

`WorkflowViewer` renders a workflow from JSON handed to it from outside — an API response, a file,
a notebook cell — with no store, router or dependency injection to set up. It shows the workflow's
units as cards, and the units of the selected subworkflow as a flowchart.

```tsx
import { WorkflowViewer } from "@mat3ra/wove";

<WorkflowViewer workflow={workflowConfig} />;
```

`workflow` accepts `@mat3ra/esse`'s `WorkflowSchema`, a `JobSchema` (or any payload carrying the
workflow under `workflow`), a JSON string of either, or a `@mat3ra/wode` `Workflow` the host app
already holds. Under the hood `createWorkflowFromConfig()` builds that `Workflow`, which is what
gives the cards their subworkflows, model instances, properties and statuses.

The types are the ecosystem's own, not wove's: ESSE schemas describe the JSON going in, wode
entities are what comes out, and there is no third description of a workflow in between. The
entity validates against the ESSE schemas on the way in, so a config that is not valid ESSE is
reported in place — the viewer shows what is wrong with it instead of a half-populated view.

| prop                    | default           |                                                      |
| ----------------------- | ----------------- | ---------------------------------------------------- |
| `workflow`              | —                 | the workflow JSON (or instance) to show              |
| `title`                 | its name          | heading for the workflow                             |
| `showHeader`            | `true`            | show the name / unit count / application heading     |
| `showFlowchart`         | `true`            | show the selected subworkflow's units as a flowchart |
| `flowchartHeight`       | `520`             | height of the flowchart pane                         |
| `isCardContentExpanded` | `true`            | start the unit cards expanded                        |
| `editable`              | `false`           | enable copying a unit's JSON from its card           |
| `onUnitSelect`          | —                 | called with the workflow unit whose card was clicked |
| `ApplicationComponent`  | read-only summary | e.g. `@mat3ra/ave`'s `Application`                   |
| `ModelComponent`        | read-only summary | e.g. `@mat3ra/move`'s `Model`                        |

## Show a workflow from any page

The standalone bundle exposes `window.renderWorkflow(workflowConfig, container, options)`, so a page
that does not build against wove can still render a workflow it has the JSON for. Same contract as
[wave.js](https://github.com/mat3ra/wave.js)' `window.renderThreeDEditor(materialConfig, container)`:

```html
<div id="wove-1" style="width: 900px; height: 700px"></div>
<script type="module">
    const workflowConfig = {/* ... */};
    const container = document.getElementById("wove-1");
    await import("https://mat3ra.github.io/wove/main.js");
    window.renderWorkflow(workflowConfig, container);

    document.head.insertAdjacentHTML(
        "beforeend",
        '<link rel="stylesheet" href="https://mat3ra.github.io/wove/main.css"/>',
    );
</script>
```

`container` defaults to `#root`; `options` takes the `WorkflowViewer` props above plus `themeMode`
(`"dark"` by default, or `"light"`). The bundle is deployed to GitHub Pages on every release.
Importing it registers the ESSE schemas it needs and defines the global — it renders nothing until
called, so it is safe to load on a page that has a `#root` of its own.

### In a Jupyter notebook

The viewer helpers in [mat3ra/api-examples](https://github.com/mat3ra/api-examples) emit exactly
that snippet — the same ones that embed wave.js, pointed at this bundle:

```python
import json

from IPython.display import HTML, Javascript, display
from mat3ra.notebooks_utils.ipython.ui import get_viewer_html, get_viewer_js

div_id = "wove-1"
html = get_viewer_html(
    div_id=div_id, width=900, height=700, title="Workflow", custom_styles="border:1px solid #333;"
)
js = get_viewer_js(
    data_json=json.dumps(workflow_config),
    div_id=div_id,
    bundle_url="https://mat3ra.github.io/wove/main.js",
    render_function="renderWorkflow",
    data_var_name="workflowConfig",
    css_url="https://mat3ra.github.io/wove/main.css",
    extra_config_json='{"themeMode": "light"}',  # optional, the `options` argument
)
display(HTML(html))
display(Javascript(js))
```

## Development

```bash
npm run dev               # demo page on http://localhost:3007 — pick a standata workflow, or
                          # paste workflow JSON to render it
npm run build             # library build (tsc) → dist/
npm run build:standalone  # bundle → build/main.js + build/main.css
npm test
```
