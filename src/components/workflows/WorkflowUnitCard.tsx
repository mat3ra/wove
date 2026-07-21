import { useCopyToClipboard } from "@mat3ra/cove/dist/hooks/useCopyToClipboard";
import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import Code from "@mat3ra/code";
import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import type { AnyWorkflowUnit } from "@mat3ra/wode/dist/js/units/factory";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useMemo } from "react";
import s from "underscore.string";

import { UnitsAccordion } from "../units/UnitsAccordion";
import { OverviewAccordion } from "./OverviewAccordion";

import { CardFooter } from "../common/CardFooter";
import { CardHeader } from "../common/CardHeader";

export type WorkflowUnitCardProps = {
    index: number;
    unit: any;
    isSelected?: boolean;
    onClick: (unit: any) => void;
    isRemovable?: boolean;
    onRemove: (flowchartId: string) => void;
    subworkflow: WodeSubworkflow | null | undefined;
    isCardContentExpanded?: boolean;
    editable?: boolean;
    headerStatusCls: (unit: any) => string;
    onUpdate?: (subworkflow: SubworkflowSchema) => void;
    onApplicationUpdate?: (...args: unknown[]) => void;
    onModelUpdate?: (...args: unknown[]) => void;
    ApplicationComponent?: React.ComponentType<any>;
    ModelComponent?: React.ComponentType<any>;
};

export function WorkflowUnitCard({
    index,
    unit,
    isSelected = false,
    onClick,
    isRemovable = false,
    onRemove,
    subworkflow,
    isCardContentExpanded = true,
    editable = false,
    headerStatusCls,
    onUpdate,
    onApplicationUpdate,
    onModelUpdate,
    ApplicationComponent,
    ModelComponent,
}: WorkflowUnitCardProps) {
    const theme = useTheme();
    const copyToClipboard = useCopyToClipboard();

    const contentToCopy = useMemo(
        () => (subworkflow?._json ? JSON.stringify(subworkflow._json, null, 4) : unit.flowchartId),
        [subworkflow, unit.flowchartId],
    );

    const actions = useMemo(
        () => [
            {
                id: `copy-${s.slugify(unit.name)}`,
                disabled: false,
                content: "Copy",
                icon: <IconByName name="actions.copy" />,
                onClick: () => {
                    copyToClipboard(contentToCopy, `Unit '${unit.name}' was successfully copied`);
                },
            },
            {
                id: `delete-${s.slugify(unit.name)}`,
                content: "Delete",
                disabled: !isRemovable,
                icon: <IconByName name="actions.delete" />,
                onClick: () => onRemove(unit.flowchartId),
            },
        ],
        [unit.name, unit.flowchartId, contentToCopy, copyToClipboard, isRemovable, onRemove],
    );

    const onCardClick = useCallback(
        (e: React.MouseEvent) => {
            // Select on any card click that is not on a real control (copy/delete IconButtons,
            // dropdown items). Do NOT gate on e.defaultPrevented: the Overview/Units accordion
            // summaries call preventDefault() to mark the expansion toggle as handled (see
            // cove's Accordion), and the pre-extraction webapp relied on card clicks landing
            // there still moving the selection — the subworkflow panel must follow whichever
            // card the user interacts with.
            const isControlClick = Boolean((e.target as Element | null)?.closest?.("button, a"));
            if (!isControlClick) onClick(unit);
        },
        [onClick, unit],
    );

    const avatarIndex = Code.utils.convertArabicToRoman(index);
    const borderColor = isSelected ? theme.palette.primary.main : "transparent";
    const badgeColor = headerStatusCls(unit);

    const nestedUnits = subworkflow?.unitsInstances;

    return (
        <Card
            id={`workflow-card-unit-${s.slugify(unit.name)}`}
            onClick={onCardClick}
            sx={{ width: "100%", minWidth: "280px", cursor: "pointer" }}
        >
            <Box sx={{ border: `4px solid ${borderColor}` }}>
                <CardHeader
                    avatarType="roman"
                    avatarIndex={avatarIndex}
                    badgeColor={badgeColor}
                    title={unit.name}
                    status={unit.status ?? ""}
                    subheader={unit.flowchartId}
                    actions={actions}
                    isExpanded={isCardContentExpanded}
                    contentToCopy={contentToCopy}
                />
                {isCardContentExpanded && (
                    <>
                        <Divider />
                        <CardFooter justifyContent="space-around" actions={actions} />
                    </>
                )}
                <Divider />
                {subworkflow ? (
                    <OverviewAccordion
                        isSubworkflowOverview
                        editable={editable}
                        subworkflow={subworkflow}
                        onUpdate={onUpdate}
                        onApplicationUpdate={onApplicationUpdate}
                        onModelUpdate={onModelUpdate}
                        ApplicationComponent={ApplicationComponent}
                        ModelComponent={ModelComponent}
                    />
                ) : null}
                {Boolean(nestedUnits?.length) && (
                    <>
                        <Divider />
                        <UnitsAccordion units={nestedUnits ?? []} />
                    </>
                )}
            </Box>
        </Card>
    );
}
