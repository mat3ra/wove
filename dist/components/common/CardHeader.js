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
export function CardHeader({ title = "", subheader = "", avatarIndex, avatarType = "arabic", actions = [], status = "", badgeColor = "default", isExpanded = false, contentToCopy, showDeveloperInfo = false, showStatus = false, }) {
    const avatarVariant = avatarType === "roman" ? "rounded" : "circular";
    const isBadge = avatarType !== "roman" && showStatus;
    const safeBadgeColor = BADGE_COLORS.includes(badgeColor) ? badgeColor : "default";
    // The id row is the only thing in the subheader, so when it is hidden the
    // subheader goes with it rather than leaving an empty line under the title.
    const isSubheaderShown = showDeveloperInfo && Boolean(subheader);
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
                }, actions: actions, paperPlacement: "bottom-start", children: _jsx(IconButton, { children: _jsx(IconByName, { fontSize: "small", name: "shapes.dots.vertical" }) }) }) })), title: _jsx(Typography, { noWrap: true, variant: "subtitle2", color: "text.primary", children: title }), subheader: !isSubheaderShown ? null : (_jsxs(Subheader, { children: [isExpanded ? (_jsx(Box, { children: _jsx(Typography, { variant: "caption", noWrap: true, sx: { width: "100%" }, children: "Flowchart ID:\u00A0" }) })) : null, _jsxs(FlowchartIdContainer, { children: [_jsx(Typography, { variant: "caption", noWrap: true, children: subheader }), _jsx(IconButton, { onClick: () => copyToClipboardSafe(contentToCopy !== null && contentToCopy !== void 0 ? contentToCopy : "").then((ok) => {
                                if (ok) {
                                    showSuccessAlert(`Unit ${title} was successfully copied`);
                                }
                            }), children: _jsx(IconByName, { name: "actions.copy" }) })] })] })) }));
}
