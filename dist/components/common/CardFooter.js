import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Minimal stub for the Meteor CardFooter component.
 * Renders action buttons in a horizontal row.
 */
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
export function CardFooter({ actions = [], justifyContent = "flex-start" }) {
    return (_jsx(Box, { display: "flex", justifyContent: justifyContent, px: 1, py: 0.5, children: actions.map((action, index) => {
            var _a, _b, _c;
            return (_jsx(Tooltip, { title: (_a = action.content) !== null && _a !== void 0 ? _a : "", children: _jsx("span", { children: _jsx(IconButton, { id: action.id, size: "small", disabled: action.disabled, onClick: action.onClick, children: (_b = action.icon) !== null && _b !== void 0 ? _b : null }) }) }, (_c = action.id) !== null && _c !== void 0 ? _c : index));
        }) }));
}
