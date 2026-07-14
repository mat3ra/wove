/**
 * Minimal stub for the Meteor CardFooter component.
 * Renders action buttons in a horizontal row.
 */
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
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

export function CardFooter({ actions = [], justifyContent = "flex-start" }: CardFooterProps) {
    return (
        <Box display="flex" justifyContent={justifyContent} px={1} py={0.5}>
            {actions.map((action, index) => (
                <Tooltip key={action.id ?? index} title={action.content ?? ""}>
                    <span>
                        <IconButton
                            id={action.id}
                            size="small"
                            disabled={action.disabled}
                            onClick={action.onClick}
                        >
                            {action.icon ?? null}
                        </IconButton>
                    </span>
                </Tooltip>
            ))}
        </Box>
    );
}
