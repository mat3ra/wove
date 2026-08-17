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
    /**
     * Show the flowchart ID and its copy control. Off by default: the ID is a UUID that
     * identifies nothing to a person reading a card, while repeating it under every unit
     * costs most of a card's subheader. Hosts expose it behind a "developer info" toggle.
     */
    showDeveloperInfo?: boolean;
    /**
     * Show the run-status badge. Status belongs to a job's execution, so a designer editing
     * a workflow template turns it off — there, every unit is perpetually "idle".
     */
    showStatus?: boolean;
}
export declare function CardHeader({ title, subheader, avatarIndex, avatarType, actions, status, badgeColor, isExpanded, contentToCopy, showDeveloperInfo, showStatus, }: CardHeaderProps): React.JSX.Element;
