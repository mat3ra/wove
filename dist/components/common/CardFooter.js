import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Port of the webapp's organisms/card/CardFooter - labeled text buttons (VIEW / DELETE /
 * CLONE / ...) with a leading icon, matching the production card look.
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
export function CardFooter({ actions = [], variant = "text", color = "primary", justifyContent = "space-between", }) {
    return (_jsx(CardActions, { disableSpacing: true, children: _jsx(Box, { sx: {
                display: "flex",
                justifyContent,
                width: "100%",
            }, children: actions.map((action, index) => {
                const { onClick, content, icon, disabled, id } = action;
                return (_jsx(Button, { id: id, variant: variant, startIcon: icon, color: color, onClick: onClick, disabled: disabled, children: content }, `${content}-${index}`));
            }) }) }));
}
