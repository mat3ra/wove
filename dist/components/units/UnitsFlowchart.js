import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, Controls, useReactFlow, } from "reactflow";
import { nodeTypes } from "../reactflow/customNodes/NodeTypes";
import useAutoLayout from "../reactflow/hooks/useAutoLayout";
import { transformUnitsToNodesAndEdges } from "../reactflow/hooks/useTransformUnitsToNodesAndEdges";
import { Direction } from "./types";
function UnitsFlowchart(props) {
    const { units, areUnitsExpanded, unitIndex, onUnitSelect, getActions, autoFitToView, isFocused, } = props;
    const [direction] = useState(Direction.TB);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [nodesAndEdgesUpdated, setNodesAndEdgesUpdated] = useState(false);
    const { fitView } = useReactFlow();
    useAutoLayout({ direction, nodesAndEdgesUpdated });
    const onNodesChange = (changes) => {
        setNodes((nodes) => applyNodeChanges(changes, nodes));
    };
    const onEdgesChange = (changes) => {
        setEdges((edges) => applyEdgeChanges(changes, edges));
    };
    const unitNames = units.reduce((acc, unit) => `${acc}${unit.name}`, ""); // use joined str to avoid arr reference comparison
    useEffect(() => {
        const { nodes: nextNodes, edges: nextEdges } = transformUnitsToNodesAndEdges({
            units,
            direction,
            unitIndex,
            areUnitsExpanded,
            getActions,
            onUnitSelect,
        });
        // Carry layout state (position + handle sides + style) from the previous render for any
        // node whose id (== unit.flowchartId) still exists. Without this, every units update
        // replaces all nodes with fresh objects at (0,0) and the user sees a full wipe-and-redraw
        // before useAutoLayout's rAF reflows them.
        setNodes((prevNodes) => {
            const prevById = new Map(prevNodes.map((n) => [n.id, n]));
            return nextNodes.map((node) => {
                const prev = prevById.get(node.id);
                if (!prev)
                    return node;
                return {
                    ...node,
                    position: prev.position,
                    sourcePosition: prev.sourcePosition,
                    targetPosition: prev.targetPosition,
                    style: prev.style,
                };
            });
        });
        setEdges((prevEdges) => {
            const prevById = new Map(prevEdges.map((e) => [e.id, e]));
            return nextEdges.map((edge) => {
                const prev = prevById.get(edge.id);
                if (!prev)
                    return edge;
                return { ...edge, style: prev.style };
            });
        });
        setNodesAndEdgesUpdated(true);
    }, [
        units,
        unitNames,
        units.length,
        unitIndex,
        areUnitsExpanded,
        direction,
        getActions,
        onUnitSelect,
    ]);
    // used to force execution order of nodes/edges update and automatic layout
    useEffect(() => {
        if (nodesAndEdgesUpdated) {
            setNodesAndEdgesUpdated(false);
        }
    }, [nodesAndEdgesUpdated]);
    useEffect(() => {
        if (autoFitToView) {
            fitView({ duration: 400 });
        }
    }, [fitView, nodes, autoFitToView]);
    return (_jsxs(ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, nodeTypes: nodeTypes, nodeOrigin: [0.5, 0.5], proOptions: { hideAttribution: true }, preventScrolling: isFocused, zoomOnScroll: isFocused, minZoom: 0.2, fitView: true, children: [_jsx(Background, { gap: 16, size: 0.5, color: "000" }), _jsx(Controls, {})] }));
}
export default UnitsFlowchart;
