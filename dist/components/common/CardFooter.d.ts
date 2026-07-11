import React from "react";
export interface CardFooterAction {
    id?: string;
    content?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}
export interface CardFooterProps {
    actions?: CardFooterAction[];
    justifyContent?: string;
}
export declare function CardFooter({ actions, justifyContent }: CardFooterProps): React.JSX.Element;
