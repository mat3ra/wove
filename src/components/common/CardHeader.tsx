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
    showDeveloperInfo = false,
    showStatus = true,
}: CardHeaderProps) {
    const avatarVariant = avatarType === "roman" ? "rounded" : "circular";
    const isBadge = avatarType !== "roman" && showStatus;
    const safeBadgeColor = BADGE_COLORS.includes(badgeColor) ? badgeColor : "default";

    return (
        <StyledCardHeader
            avatar={
                <StyledBadge
                    color={safeBadgeColor as any}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    title={showStatus ? s.capitalize(status) : ""}
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
                showDeveloperInfo ? (
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
                ) : null
            }
        />
    );
}
