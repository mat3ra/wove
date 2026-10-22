import Card from "@mui/material/Card";
import type { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

type PaletteWithUnitTypes = Theme["palette"] & {
    unitTypes?: Record<string, string | undefined>;
};

/**
 * `theme.designer.*` arrives with cove 2026.8+; wove still builds against older pins, so the
 * tokens are read defensively and every call site keeps the value it used before.
 */
export type ThemeWithDesignerTokens = Theme & {
    designer?: {
        canvas?: { selection?: string };
        node?: { background?: string };
    };
};

/**
 * Border colours for a unit card.
 *
 * The resting border is meant to be invisible: it reserves the width the selected border takes,
 * so selecting a card does not shift it. It was the literal string `"white"`, which is only
 * invisible on a white surface — on a dark canvas every unselected card wore a bright frame.
 * It now follows the surface the card sits on.
 */
export function getUnitCardBorderColors(theme: Theme): { resting: string; selected: string } {
    const { designer } = theme as ThemeWithDesignerTokens;
    return {
        resting: designer?.node?.background ?? theme.palette.background.paper ?? "white",
        selected: designer?.canvas?.selection ?? theme.palette.primary.dark,
    };
}

export type StyledCardProps = {
    isAnimateOnHover?: boolean;
    isBorder?: boolean;
};

export const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "isAnimateOnHover" && prop !== "isBorder",
})<StyledCardProps>(({ theme, isAnimateOnHover, isBorder }) => ({
    width: "100%",
    cursor: "pointer",
    border: isBorder ? `1px solid ${(theme.palette as any).border?.dark || "#cecece"}` : "none",
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
}));

export type InnerContainerProps = {
    type?: string;
    isSelected?: boolean;
    isTypeColor?: boolean;
};

export const InnerContainer = styled("div")<InnerContainerProps>(({
    theme,
    type = "",
    isSelected,
    isTypeColor,
}) => {
    const { palette } = theme;
    const { unitTypes } = palette as PaletteWithUnitTypes;
    const { designer } = theme as ThemeWithDesignerTokens;
    // The unselected border is meant to be invisible — it reserves the width the selected
    // one takes, so selecting a card does not shift it. Hardcoded white, it was a bright
    // frame around every card on a dark canvas.
    const restingBorderColor = designer?.node?.background ?? palette.background.paper ?? "white";
    const selectedBorderColor = designer?.canvas?.selection ?? palette.primary.dark;
    return {
        border: `4px solid ${isSelected ? selectedBorderColor : restingBorderColor}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",

        "&:before": {
            minWidth: 10,
            content: isTypeColor ? '""' : "none",
            display: "block",
            backgroundColor:
                type === "error" ? palette.error.main : unitTypes?.[type] || palette.grey[600],
            height: "101%",
            position: "absolute",
            top: "-1px",
            left: "-1px",
            borderRadius: "4px 0 0 4px",
        },
    };
});
