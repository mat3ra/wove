import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Minimal stub for the Meteor CardHeader component.
 * Props mirror what UnitCard and WorkflowUnitCard pass to it.
 */
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MuiCardHeader from "@mui/material/CardHeader";
export function CardHeader({ title, subheader, avatarIndex, badgeColor = "default", status, }) {
    var _a, _b;
    const colorMap = {
        default: "#9e9e9e",
        warning: "#ff9800",
        error: "#f44336",
        success: "#4caf50",
    };
    const avatarBg = (_b = (_a = colorMap[badgeColor]) !== null && _a !== void 0 ? _a : badgeColor) !== null && _b !== void 0 ? _b : "#9e9e9e";
    return (_jsx(MuiCardHeader, { avatar: _jsx(Avatar, { sx: { bgcolor: avatarBg, width: 32, height: 32, fontSize: "0.8rem" }, children: avatarIndex !== null && avatarIndex !== void 0 ? avatarIndex : "?" }), title: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [title, status && _jsx(Chip, { label: status, size: "small" })] }), subheader: _jsx(Box, { sx: { fontSize: "0.65rem", opacity: 0.6, wordBreak: "break-all" }, children: subheader }), 
        // Fixed 73px height matches the original webapp CardHeader organism
        // (CardHeader.styled StyledCardHeader). Keeping this height is load-bearing:
        // it puts the card's geometric center on the neutral CardFooter strip, so
        // center-clicks (Cypress unit selection) hit an area that does not
        // preventDefault - see the onCardClick note in WorkflowUnitCard.tsx.
        sx: { height: "73px", boxSizing: "border-box", py: 0.5, px: 1 } }));
}
