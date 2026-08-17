import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import s from "underscore.string";

import { InnerContainer, StyledCard } from "./UnitCard.styled";
import { describeUnitMeta, getUnitTypeIconName } from "./unitCardMeta";

import { CardFooter } from "../common/CardFooter";
import { CardHeader } from "../common/CardHeader";

const statusToColorEnum: Record<string, "default" | "warning" | "error" | "success"> = {
    idle: "default",
    active: "warning",
    error: "error",
    finished: "success",
};

export type UnitCardAction = Record<string, unknown>;

export type UnitCardProps = {
    index: number;
    unit: AnySubworkflowUnitSchema;
    actions?: UnitCardAction[];
    isSelected?: boolean;
    isBorder?: boolean;
    onSelect?: (unit: AnySubworkflowUnitSchema) => void;
    animateOnHover?: boolean;
    isCardContentExpanded?: boolean;
    /** Reveal the flowchart ID; see {@link CardHeader}. */
    showDeveloperInfo?: boolean;
    /** Show the run-status badge; off in designers, on in job views. */
    showStatus?: boolean;
    /** Something in this unit differs from its default; hosts derive it from `provider.isEdited`. */
    isModified?: boolean;
};

export function UnitCard({
    index,
    unit,
    actions = [],
    isSelected = false,
    isBorder = true,
    onSelect = () => undefined,
    animateOnHover = false,
    isCardContentExpanded = true,
    showDeveloperInfo = false,
    showStatus = true,
    isModified = false,
}: UnitCardProps) {
    const onCardClick = (e: React.MouseEvent) => {
        if (!e.defaultPrevented) onSelect(unit);
    };

    const avatarIndex = index > 9 ? `${index}` : `0${index}`;
    const meta = describeUnitMeta(unit);
    // The icon carries the unit's kind alongside the accent stripe, so type is not conveyed by
    // colour alone — which colour-vision deficiency, and a greyscale print, both flatten.
    const metaNode = (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
            <IconByName
                name={getUnitTypeIconName(unit.type)}
                sx={(theme: Theme) => ({
                    fontSize: 13,
                    flexShrink: 0,
                    color:
                        (theme.palette as { unitTypes?: Record<string, string> }).unitTypes?.[
                            String(unit.type)
                        ] ?? "text.secondary",
                })}
            />
            <Typography variant="caption" color="text.secondary" noWrap>
                {meta || String(unit.type ?? "")}
            </Typography>
        </Box>
    );

    return (
        <StyledCard
            id={`card-${s.slugify(unit.name)}`}
            data-flowchartid={unit.flowchartId}
            elevation={0}
            isAnimateOnHover={animateOnHover}
            isBorder={isBorder}
            onClick={onCardClick}
        >
            <InnerContainer isSelected={isSelected} type={unit.type} isTypeColor>
                <CardHeader
                    title={unit.name}
                    subheader={unit.flowchartId}
                    avatarIndex={avatarIndex}
                    actions={actions}
                    status={unit.status ?? ""}
                    badgeColor={statusToColorEnum[unit.status ?? "idle"] ?? "default"}
                    isExpanded={isCardContentExpanded && Boolean(actions.length)}
                    contentToCopy={unit.flowchartId}
                    showDeveloperInfo={showDeveloperInfo}
                    showStatus={showStatus}
                    meta={metaNode}
                    isModified={isModified}
                />
                {isCardContentExpanded && Boolean(actions.length) && (
                    <>
                        <Divider />
                        <CardFooter actions={actions} />
                    </>
                )}
            </InnerContainer>
        </StyledCard>
    );
}
