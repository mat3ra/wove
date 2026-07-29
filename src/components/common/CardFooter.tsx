/**
 * Port of the webapp's organisms/card/CardFooter - labeled text buttons (VIEW / DELETE /
 * CLONE / ...) with a leading icon, matching the production card look.
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
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

export function CardFooter({
    actions = [],
    variant = "text",
    color = "primary",
    justifyContent = "space-between",
}: CardFooterProps) {
    return (
        <CardActions disableSpacing>
            <Box
                sx={{
                    display: "flex",
                    justifyContent,
                    width: "100%",
                }}
            >
                {actions.map((action, index) => {
                    const { onClick, content, icon, disabled, id } = action;
                    return (
                        <Button
                            id={id}
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${content}-${index}`}
                            variant={variant}
                            startIcon={icon}
                            color={color}
                            onClick={onClick}
                            disabled={disabled}
                        >
                            {content}
                        </Button>
                    );
                })}
            </Box>
        </CardActions>
    );
}
