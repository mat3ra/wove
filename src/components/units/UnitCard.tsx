import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import Divider from "@mui/material/Divider";
import React from "react";
import s from "underscore.string";

import { InnerContainer, StyledCard } from "./UnitCard.styled";

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
    /** See {@link CardHeaderProps.showDeveloperInfo}. */
    showDeveloperInfo?: boolean;
    /** See {@link CardHeaderProps.showStatus}. */
    showStatus?: boolean;
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
    showStatus = false,
}: UnitCardProps) {
    const onCardClick = (e: React.MouseEvent) => {
        if (!e.defaultPrevented) onSelect(unit);
    };

    const avatarIndex = index > 9 ? `${index}` : `0${index}`;

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
