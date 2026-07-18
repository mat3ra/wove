import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Accordion from "@mat3ra/cove/dist/mui/components/accordion";
const AccordionComponent = Accordion;
import Grid from "@mui/material/Grid";
import { Properties } from "../subworkflows/Properties";
const noopSubworkflowSchema = () => undefined;
function DefaultApplication({ application }) {
    const app = application;
    if (!app)
        return null;
    const label = [app.name, app.version, app.build].filter(Boolean).join(" ");
    return (_jsxs(Grid, { item: true, xs: 12, className: "wove-default-application", children: [_jsx("strong", { children: "Application:" }), " ", label || "unknown"] }));
}
function DefaultModel({ model }) {
    var _a, _b, _c;
    const m = model;
    if (!m)
        return null;
    const label = (_c = (_a = m.name) !== null && _a !== void 0 ? _a : (_b = m.method) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "unknown";
    return (_jsxs(Grid, { item: true, xs: 12, className: "wove-default-model", children: [_jsx("strong", { children: "Model:" }), " ", label] }));
}
export function OverviewAccordion({ isSubworkflowOverview = false, isExpanded, subworkflow, editable = false, onUpdate = noopSubworkflowSchema, onApplicationUpdate = () => undefined, onModelUpdate = () => undefined, ApplicationComponent = DefaultApplication, ModelComponent = DefaultModel, }) {
    const isModelAndMethodDataShown = (!subworkflow.modelInstance.isUnknown || editable) && !isSubworkflowOverview;
    return (_jsx(AccordionComponent, { id: "subworkflow-overview-accordion", elevation: 0, defaultExpanded: isExpanded, expanded: isExpanded, disableGutters: true, header: "Overview", children: _jsxs(Grid, { container: true, direction: "row", children: [_jsx(Properties, { subworkflow: subworkflow, onUpdate: onUpdate, editable: false }), _jsx(ApplicationComponent, { application: subworkflow.application, onApplicationUpdate: onApplicationUpdate, editable: false }), isModelAndMethodDataShown && (_jsx(ModelComponent, { model: subworkflow.modelInstance, application: subworkflow.application, onUpdate: onModelUpdate, editable: false }))] }) }));
}
