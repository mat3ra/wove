import React from "react";
export interface CardHeaderProps {
    title?: string;
    subheader?: string;
    avatarIndex?: string | number;
    avatarType?: "roman" | "arabic";
    actions?: Array<Record<string, unknown>>;
    status?: string;
    badgeColor?: string;
    isExpanded?: boolean;
    contentToCopy?: string;
}
export declare function CardHeader({ title, subheader, avatarIndex, avatarType, actions, status, badgeColor, isExpanded, contentToCopy, }: CardHeaderProps): React.JSX.Element;
