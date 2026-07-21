/**
 * Minimal stub for the Meteor CardHeader component.
 * Props mirror what UnitCard and WorkflowUnitCard pass to it.
 */
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MuiCardHeader from "@mui/material/CardHeader";
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

export function CardHeader({
    title,
    subheader,
    avatarIndex,
    badgeColor = "default",
    status,
}: CardHeaderProps) {
    const colorMap: Record<string, string> = {
        default: "#9e9e9e",
        warning: "#ff9800",
        error: "#f44336",
        success: "#4caf50",
    };
    const avatarBg = colorMap[badgeColor] ?? badgeColor ?? "#9e9e9e";

    return (
        <MuiCardHeader
            avatar={
                <Avatar sx={{ bgcolor: avatarBg, width: 32, height: 32, fontSize: "0.8rem" }}>
                    {avatarIndex ?? "?"}
                </Avatar>
            }
            title={
                <Box display="flex" alignItems="center" gap={1}>
                    {title}
                    {status && <Chip label={status} size="small" />}
                </Box>
            }
            subheader={
                <Box sx={{ fontSize: "0.65rem", opacity: 0.6, wordBreak: "break-all" }}>
                    {subheader}
                </Box>
            }
            // Fixed 73px height matches the original webapp CardHeader organism
            // (CardHeader.styled StyledCardHeader). Keeping this height is load-bearing:
            // it puts the card's geometric center on the neutral CardFooter strip, so
            // center-clicks (Cypress unit selection) hit an area that does not
            // preventDefault - see the onCardClick note in WorkflowUnitCard.tsx.
            sx={{ height: "73px", boxSizing: "border-box", py: 0.5, px: 1 }}
        />
    );
}
