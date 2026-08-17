import type { Theme } from "@mui/material/styles";
/**
 * `theme.designer.*` arrives with cove 2026.8+; wove still builds against older pins, so the
 * tokens are read defensively and every call site keeps the value it used before.
 */
export type ThemeWithDesignerTokens = Theme & {
    designer?: {
        canvas?: {
            selection?: string;
        };
        node?: {
            background?: string;
        };
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
export declare function getUnitCardBorderColors(theme: Theme): {
    resting: string;
    selected: string;
};
export type StyledCardProps = {
    isAnimateOnHover?: boolean;
    isBorder?: boolean;
};
export declare const StyledCard: import("@emotion/styled").StyledComponent<import("@mui/material/Card").CardOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    ref?: ((instance: HTMLDivElement | null) => void) | import("react").RefObject<HTMLDivElement> | null | undefined;
}, "className" | "style" | "classes" | "children" | "elevation" | "square" | "sx" | "variant" | "raised"> & import("@mui/system").MUIStyledCommonProps<Theme> & StyledCardProps, {}, {}>;
export type InnerContainerProps = {
    type?: string;
    isSelected?: boolean;
    isTypeColor?: boolean;
};
export declare const InnerContainer: import("@emotion/styled").StyledComponent<import("@mui/system").MUIStyledCommonProps<Theme> & InnerContainerProps, import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
