/**
 * Port of the webapp's organisms/card/CardHeader - the unit/subworkflow card header with
 * status-badged avatar, vertical-dots actions dropdown, and the "Flowchart ID" copy field.
 * Prop contract matches what UnitCard and WorkflowUnitCard pass.
 */
import Dropdown from "@mat3ra/cove/dist/mui/components/dropdown";
import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import { showSuccessAlert } from "@mat3ra/cove/dist/other/alerts";
import { copyToClipboardSafe } from "@mat3ra/cove/dist/utils/clipboard";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React from "react";
import s from "underscore.string";

import { useWoveDisplayOptions } from "../../context/displayOptions";
import {
    ActionContainer,
    FlowchartIdContainer,
    StyledAvatar,
    StyledBadge,
    StyledCardHeader,
    Subheader,
} from "./CardHeader.styled";

const BADGE_COLORS = ["primary", "secondary", "default", "error", "info", "success", "warning"];

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

export function CardHeader({
    title = "",
    subheader = "",
    avatarIndex,
    avatarType = "arabic",
    actions = [],
    status = "",
    badgeColor = "default",
    isExpanded = false,
    contentToCopy,
    showDeveloperInfo,
    showStatus,
}: CardHeaderProps) {
    // Host-level defaults; an explicit prop still wins for a single card.
    const displayOptions = useWoveDisplayOptions();
    const isDeveloperInfoShown = showDeveloperInfo ?? displayOptions.showDeveloperInfo;
    const isStatusShown = showStatus ?? displayOptions.showStatus;

    const avatarVariant = avatarType === "roman" ? "rounded" : "circular";
    const isBadge = avatarType !== "roman" && isStatusShown;
    const safeBadgeColor = BADGE_COLORS.includes(badgeColor) ? badgeColor : "default";
    // The id row is the only thing in the subheader, so when it is hidden the
    // subheader goes with it rather than leaving an empty line under the title.
    const isSubheaderShown = isDeveloperInfoShown && Boolean(subheader);

    return (
        <StyledCardHeader
            avatar={
                <StyledBadge
                    color={safeBadgeColor as any}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    title={isStatusShown ? s.capitalize(status) : ""}
                    badgeContent={isBadge && status ? <Box>{s.capitalize(status[0])}</Box> : null}
                >
                    <StyledAvatar isBadge={isBadge} color={safeBadgeColor} variant={avatarVariant}>
                        {avatarIndex}
                    </StyledAvatar>
                </StyledBadge>
            }
            action={
                !isExpanded &&
                Boolean(actions.length) && (
                    <ActionContainer>
                        <Dropdown
                            popperProps={{
                                id: "popper",
                                modifiers: [
                                    {
                                        name: "flip",
                                        enabled: true,
                                        options: {
                                            flipVariations: ["bottom"],
                                            behavior: ["bottom"],
                                        },
                                    },
                                ],
                            }}
                            actions={actions as any}
                            paperPlacement="bottom-start"
                        >
                            <IconButton>
                                <IconByName fontSize="small" name="shapes.dots.vertical" />
                            </IconButton>
                        </Dropdown>
                    </ActionContainer>
                )
            }
            title={
                <Typography noWrap variant="subtitle2" color="text.primary">
                    {title}
                </Typography>
            }
            subheader={
                !isSubheaderShown ? null : (
                    <Subheader>
                        {isExpanded ? (
                            <Box>
                                <Typography variant="caption" noWrap sx={{ width: "100%" }}>
                                    Flowchart ID:&nbsp;
                                </Typography>
                            </Box>
                        ) : null}
                        <FlowchartIdContainer>
                            <Typography variant="caption" noWrap>
                                {subheader}
                            </Typography>
                            <IconButton
                                onClick={() =>
                                    copyToClipboardSafe(contentToCopy ?? "").then((ok: boolean) => {
                                        if (ok) {
                                            showSuccessAlert(
                                                `Unit ${title} was successfully copied`,
                                            );
                                        }
                                    })
                                }
                            >
                                <IconByName name="actions.copy" />
                            </IconButton>
                        </FlowchartIdContainer>
                    </Subheader>
                )
            }
        />
    );
}
