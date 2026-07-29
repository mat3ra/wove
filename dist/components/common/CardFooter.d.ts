import React from "react";
export interface CardFooterAction {
    id?: string;
    content?: string;
    icon?: React.ReactElement;
    onClick?: () => void;
    disabled?: boolean;
}
export interface CardFooterProps {
    actions?: CardFooterAction[];
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary" | "inherit" | "error" | "info" | "success" | "warning";
    justifyContent?: string;
}
export declare function CardFooter({ actions, variant, color, justifyContent, }: CardFooterProps): React.JSX.Element;
