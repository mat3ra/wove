import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Handle, Position } from "reactflow";
import { Direction } from "../../units/types";
const NodeContainer = styled(Box)(({ theme }) => ({
    background: theme.palette.background.default,
    borderRadius: "50%",
    width: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
}));
function DefaultNode(props) {
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
    return (_jsxs(NodeContainer, { children: [label === "End" && _jsx(Handle, { type: "target", position: target }), _jsx("div", { children: label }), label === "Start" && _jsx(Handle, { type: "source", position: source })] }));
}
export default DefaultNode;
