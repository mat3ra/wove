import type { Theme } from "@mui/material/styles";
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
