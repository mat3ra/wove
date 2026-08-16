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
     * Shows the flowchart id under the title. Off by default: an opaque UUID on
     * every card is addressed to whoever is debugging, not to the person reading
     * the workflow, and it costs a line on every card to say nothing to them.
     *
     * Hosts expose it deliberately — a "Developer info" toggle in the designer —
     * and the copy affordance stays available whenever it is shown. Usually set
     * for the whole tree via {@link WoveDisplayOptionsProvider}; this prop
     * overrides that for one card.
     */
    showDeveloperInfo?: boolean;
    /**
     * Shows the status badge on the avatar. Off by default: these cards are
     * shared between the designer, where nothing has run and every unit reports
     * a meaningless "idle", and job views, where status is the whole point.
     * Overrides {@link WoveDisplayOptionsProvider} for one card.
     */
    showStatus?: boolean;
}
export declare function CardHeader({ title, subheader, avatarIndex, avatarType, actions, status, badgeColor, isExpanded, contentToCopy, showDeveloperInfo, showStatus, }: CardHeaderProps): React.JSX.Element;
