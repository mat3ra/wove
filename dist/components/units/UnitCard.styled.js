import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
/**
 * Border colours for a unit card.
 *
 * The resting border is meant to be invisible: it reserves the width the selected border takes,
 * so selecting a card does not shift it. It was the literal string `"white"`, which is only
 * invisible on a white surface — on a dark canvas every unselected card wore a bright frame.
 * It now follows the surface the card sits on.
 */
export function getUnitCardBorderColors(theme) {
    var _a, _b, _c, _d, _e;
    const { designer } = theme;
    return {
        resting: (_c = (_b = (_a = designer === null || designer === void 0 ? void 0 : designer.node) === null || _a === void 0 ? void 0 : _a.background) !== null && _b !== void 0 ? _b : theme.palette.background.paper) !== null && _c !== void 0 ? _c : "white",
        selected: (_e = (_d = designer === null || designer === void 0 ? void 0 : designer.canvas) === null || _d === void 0 ? void 0 : _d.selection) !== null && _e !== void 0 ? _e : theme.palette.primary.dark,
    };
}
export const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "isAnimateOnHover" && prop !== "isBorder",
})(({ theme, isAnimateOnHover, isBorder }) => {
    var _a;
    return ({
        width: "100%",
        cursor: "pointer",
        border: isBorder ? `1px solid ${((_a = theme.palette.border) === null || _a === void 0 ? void 0 : _a.dark) || "#cecece"}` : "none",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: isAnimateOnHover
            ? ".3s transform cubic-bezier(.155,1.105,.295,1.12),.3s box-shadow,.3s -webkit-transform cubic-bezier(.155,1.105,.295,1.12);"
            : undefined,
        "&:hover": isAnimateOnHover
            ? {
                transform: "scale(1.05)",
                boxShadow: "0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)",
            }
            : undefined,
    });
});
export const InnerContainer = styled("div")(({ theme, type = "", isSelected, isTypeColor, }) => {
    var _a, _b, _c, _d, _e;
    const { palette } = theme;
    const { unitTypes } = palette;
    const { designer } = theme;
    // The unselected border is meant to be invisible — it reserves the width the selected
    // one takes, so selecting a card does not shift it. Hardcoded white, it was a bright
    // frame around every card on a dark canvas.
    const restingBorderColor = (_c = (_b = (_a = designer === null || designer === void 0 ? void 0 : designer.node) === null || _a === void 0 ? void 0 : _a.background) !== null && _b !== void 0 ? _b : palette.background.paper) !== null && _c !== void 0 ? _c : "white";
    const selectedBorderColor = (_e = (_d = designer === null || designer === void 0 ? void 0 : designer.canvas) === null || _d === void 0 ? void 0 : _d.selection) !== null && _e !== void 0 ? _e : palette.primary.dark;
    return {
        border: `4px solid ${isSelected ? selectedBorderColor : restingBorderColor}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        "&:before": {
            minWidth: 10,
            content: isTypeColor ? '""' : "none",
            display: "block",
            backgroundColor: type === "error" ? palette.error.main : (unitTypes === null || unitTypes === void 0 ? void 0 : unitTypes[type]) || palette.grey[600],
            height: "101%",
            position: "absolute",
            top: "-1px",
            left: "-1px",
            borderRadius: "4px 0 0 4px",
        },
    };
});
