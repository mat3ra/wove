/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import Checkbox from "@mat3ra/cove.js/dist/mui/components/checkbox/Checkbox";
const CheckboxComponent = Checkbox as any;
import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useCallback } from "react";
import _ from "underscore";
import s from "underscore.string";

import InfoPopover from "@mat3ra/cove.js/dist/mui/components/popover/info-popover/InfoPopover";

export type PropertiesProps = {
    subworkflow: WodeSubworkflow;
    onUpdate: (subworkflow: SubworkflowSchema) => void;
    editable?: boolean;
};

export function Properties({ subworkflow, onUpdate, editable = true }: PropertiesProps) {
    const onIsDraftChange = useCallback(
        (bool: boolean) => {
            subworkflow.setIsDraft(bool);
            onUpdate(subworkflow.toJSON());
        },
        [subworkflow, onUpdate],
    );

    const properties = subworkflow.properties.map((property, index) => (
        <Chip
            label={property}
            key={s.slugify(`${property}${index}`)}
            sx={{ fontSize: "12px", m: 0.5 }}
        />
    ));

    if (_.isEmpty(properties)) return null;

    return (
        <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="text.primary">
                    Properties
                </Typography>
                <InfoPopover title="Subworkflow Properties">
                    Resulting properties will not be available in "Analytics" when <b>draft</b> is
                    checked. Use this while prototyping a new workflow with low-fidelity runs.
                </InfoPopover>
            </Stack>
            <Box>{properties}</Box>
            <CheckboxComponent
                label="Draft"
                value={subworkflow.isDraft}
                onChange={(checked: boolean) => {
                    onIsDraftChange(checked);
                }}
                checked={subworkflow.isDraft}
                disabled={!editable}
                sx={{ pl: 1 }}
                slotProps={{
                    typography: {
                        pl: 0,
                        variant: "caption",
                        color: "text.primary",
                    },
                }}
            />
        </Stack>
    );
}
