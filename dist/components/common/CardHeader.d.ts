import React from "react";
export interface CardHeaderProps {
    title?: string;
    subheader?: string;
    avatarIndex?: string | number;
    avatarType?: "roman" | "numeric";
    actions?: Array<Record<string, unknown>>;
    status?: string;
    badgeColor?: "default" | "warning" | "error" | "success" | string;
    isExpanded?: boolean;
    contentToCopy?: string;
}
export declare function CardHeader({ title, subheader, avatarIndex, badgeColor, status, }: CardHeaderProps): React.JSX.Element;
