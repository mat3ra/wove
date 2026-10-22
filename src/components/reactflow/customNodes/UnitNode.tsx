import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import React from "react";
import { Handle } from "reactflow";

import { NodeData } from "../../units/types";
import { UnitCard } from "../../units/UnitCard";
import { useNodeData } from "../hooks/useNodeData";

const CardContainer = styled(Box)(() => ({
    maxWidth: "320px",
    minWidth: "200px",
    width: "100%",
}));

interface Props {
    data: NodeData;
}

function UnitNode(props: Props) {
    const { data } = props;

    const {
        index,
        isCardContentExpanded,
        unit,
        isSelected,
        onSelect,
        actions,
        animateOnHover,
        sourcePosition,
        targetPosition,
        sourceHandleStyles,
        sourceHandleLabels,
        showDeveloperInfo,
        showStatus,
    } = useNodeData(data);

    return (
        <CardContainer>
            <Handle type="target" position={targetPosition} />
            <UnitCard
                index={index}
                isCardContentExpanded={isCardContentExpanded}
                unit={unit}
                isSelected={isSelected}
                onSelect={(unit) => onSelect(unit)}
                actions={actions as any}
                animateOnHover={animateOnHover}
                showDeveloperInfo={showDeveloperInfo}
                showStatus={showStatus}
            />
            {sourceHandleStyles.map((style, i) => (
                <Handle
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    type="source"
                    position={sourcePosition}
                    style={style}
                    id={sourceHandleLabels?.[i]}
                />
            ))}
        </CardContainer>
    );
}

export default UnitNode;
