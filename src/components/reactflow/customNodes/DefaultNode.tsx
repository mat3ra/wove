import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import React from "react";
import { Handle, Position } from "reactflow";

import { Direction, NodeData } from "../../units/types";

const NodeContainer = styled(Box)(({ theme }) => ({
    background: theme.palette.background.default,
    borderRadius: "50%",
    width: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
}));

interface Props {
    data: NodeData;
}
function DefaultNode(props: Props) {
    const { data } = props;
    const { direction = Direction.TB, label } = data;

    const handlePositions = {
        TB: {
            source: Position.Bottom,
            target: Position.Top,
        },
        LR: {
            source: Position.Right,
            target: Position.Left,
        },
    };

    const { target, source } = handlePositions[direction];

    return (
        <NodeContainer>
            {label === "End" && <Handle type="target" position={target} />}
            <div>{label}</div>
            {label === "Start" && <Handle type="source" position={source} />}
        </NodeContainer>
    );
}

export default DefaultNode;
