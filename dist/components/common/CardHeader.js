import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Port of the webapp's organisms/card/CardHeader - the unit/subworkflow card header with
 * status-badged avatar, vertical-dots actions dropdown, and the "Flowchart ID" copy field.
 * Prop contract matches what UnitCard and WorkflowUnitCard pass.
 */
import Dropdown from "@mat3ra/cove/dist/mui/components/dropdown";
import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import { showSuccessAlert } from "@mat3ra/cove/dist/other/alerts";
import { copyToClipboardSafe } from "@mat3ra/cove/dist/utils/clipboard";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import s from "underscore.string";
import { ActionContainer, FlowchartIdContainer, StyledAvatar, StyledBadge, StyledCardHeader, Subheader, } from "./CardHeader.styled";
const BADGE_COLORS = ["primary", "secondary", "default", "error", "info", "success", "warning"];
export function CardHeader({ title = "", subheader = "", avatarIndex, avatarType = "arabic", actions = [], status = "", badgeColor = "default", isExpanded = false, contentToCopy, showDeveloperInfo = false, showStatus = true, meta = null, isModified = false, }) {
    const avatarVariant = avatarType === "roman" ? "rounded" : "circular";
    const isBadge = avatarType !== "roman" && showStatus;
    const safeBadgeColor = BADGE_COLORS.includes(badgeColor) ? badgeColor : "default";
    return (_jsx(StyledCardHeader, { avatar: _jsx(StyledBadge, { color: safeBadgeColor, overlap: "circular", anchorOrigin: { vertical: "bottom", horizontal: "right" }, title: showStatus ? s.capitalize(status) : "", badgeContent: isBadge && status ? _jsx(Box, { children: s.capitalize(status[0]) }) : null, children: _jsx(StyledAvatar, { isBadge: isBadge, color: safeBadgeColor, variant: avatarVariant, children: avatarIndex }) }), action: !isExpanded &&
            Boolean(actions.length) && (_jsx(ActionContainer, { children: _jsx(Dropdown, { popperProps: {
                    id: "popper",
                    modifiers: [
                        {
                            name: "flip",
                            enabled: true,
                            options: {
                                flipVariations: ["bottom"],
                                behavior: ["bottom"],
                            },
                        },
                    ],
                }, actions: actions, paperPlacement: "bottom-start", children: _jsx(IconButton, { children: _jsx(IconByName, { fontSize: "small", name: "shapes.dots.vertical" }) }) }) })), title: _jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }, children: [_jsx(Typography, { noWrap: true, variant: "subtitle2", color: "text.primary", children: title }), isModified ? (_jsx(Box, { "data-tid": "unit-card-modified", title: "Changed from the default", sx: (theme) => {
                        var _a, _b, _c;
                        return ({
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            flexShrink: 0,
                            backgroundColor: (_c = (_b = (_a = theme.designer) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.modified) !== null && _c !== void 0 ? _c : theme.palette.warning.main,
                        });
                    } })) : null] }), subheader: !showDeveloperInfo ? (meta || null) : (_jsxs(Subheader, { children: [isExpanded ? (_jsx(Box, { children: _jsx(Typography, { variant: "caption", noWrap: true, sx: { width: "100%" }, children: "Flowchart ID:\u00A0" }) })) : null, _jsxs(FlowchartIdContainer, { children: [_jsx(Typography, { variant: "caption", noWrap: true, children: subheader }), _jsx(IconButton, { onClick: () => copyToClipboardSafe(contentToCopy !== null && contentToCopy !== void 0 ? contentToCopy : "").then((ok) => {
                                if (ok) {
                                    showSuccessAlert(`Unit ${title} was successfully copied`);
                                }
                            }), children: _jsx(IconByName, { name: "actions.copy" }) })] })] })) }));
}
