import { stratify, tree } from "d3-hierarchy";
import { useEffect } from "react";
import { Edge, Node, Position, ReactFlowState, useReactFlow, useStore } from "reactflow";

import { Direction } from "../../units/types";

export type Options = {
    direction: Direction;
    nodesAndEdgesUpdated: boolean;
};

const positionMap: Record<string, Position> = {
    T: Position.Top,
    L: Position.Left,
    R: Position.Right,
    B: Position.Bottom,
};

const getPosition = (x: number, y: number, direction: Direction) => {
    switch (direction) {
        case Direction.LR:
            return { x: y, y: x };
        case Direction.RL:
            return { x: -y, y: -x };
        case Direction.BT:
            return { x: -x, y: -y };
        default:
            return { x, y };
    }
};

const NodeSizes = {
    TB: [320, 180],
    LR: [240, 320],
};

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;
const nodesInitializedSelector = (state: ReactFlowState) =>
    Array.from(state.nodeInternals.values()).every((node: any) => node.width && node.height);

/** Not a real React Flow id — only used inside d3 stratify when the graph has several roots. */
const STRATIFY_LAYOUT_ROOT_ID = "__stratify_layout_root__";

function nodesWithIncomingTargets(edges: Edge[]): Set<string> {
    return new Set(edges.map((e) => e.target));
}

function stratifyRoots(nodes: Node[], edges: Edge[]): Node[] {
    const targets = nodesWithIncomingTargets(edges);
    return nodes.filter((n) => !targets.has(n.id));
}

function virtualStratifyRootNode(): Node {
    return {
        id: STRATIFY_LAYOUT_ROOT_ID,
        position: { x: 0, y: 0 },
        data: {},
        type: "default",
        draggable: false,
    };
}

function useAutoLayout(options: Options) {
    const { direction, nodesAndEdgesUpdated } = options;
    const nodeCount = useStore(nodeCountSelector);
    const nodesInitialized = useStore(nodesInitializedSelector);
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    useEffect(() => {
        // only run the layout if there are nodes and they have been initialized with their dimensions
        if (!nodeCount || !nodesInitialized) {
            return;
        }

        let rafId = 0;
        rafId = requestAnimationFrame(() => {
            const layout = tree<Node>()
                // the node size configures the spacing between the nodes ([width, height])
                .nodeSize((NodeSizes as unknown as Record<string, [number, number]>)[direction])
                // this is needed for creating equal space between all nodes
                .separation(() => 1);

            const nodes: Node[] = getNodes();
            const edges: Edge[] = getEdges();
            const nodeIds = new Set(nodes.map((n) => n.id));
            const edgesForStratify = edges.filter(
                (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
            );

            // TODO: build custom automatic layout functionality to avoid this conflict associated with multiple heads
            try {
                const roots = stratifyRoots(nodes, edgesForStratify);
                // d3 stratify allows exactly one root (no incoming edge). Convergence / filtered edges
                // can yield several; a synthetic parent fixes that. If roots.length === 0 (e.g. cycle),
                // skip the virtual root — it would be disconnected — and let stratify/catch handle it.
                const needsVirtualRoot = roots.length > 1;
                const nodesForStratify = needsVirtualRoot
                    ? [virtualStratifyRootNode(), ...nodes]
                    : nodes;

                const hierarchy = stratify<Node>()
                    .id((d) => d.id)
                    // get the id of each node by searching through the edges
                    // this only works if every node has one connection
                    .parentId((node: Node) => {
                        if (node.id === STRATIFY_LAYOUT_ROOT_ID) {
                            return undefined;
                        }
                        const parentSource = edgesForStratify.find(
                            (edge: Edge) => edge.target === node.id,
                        )?.source;
                        if (parentSource != null) {
                            return parentSource;
                        }
                        return needsVirtualRoot ? STRATIFY_LAYOUT_ROOT_ID : undefined;
                    })(nodesForStratify);

                // run the layout algorithm with the hierarchy data structure
                const root = layout(hierarchy);

                // set the React Flow nodes with the positions from the layout
                setNodes((nodes) =>
                    nodes.map((node) => {
                        // find the node in the hierarchy with the same id and get its coordinates
                        const { x, y } = root.find((d) => d.id === node.id) || {
                            x: node.position.x,
                            y: node.position.y,
                        };

                        const adjustedY = y;

                        return {
                            ...node,
                            sourcePosition: positionMap[direction[1]],
                            targetPosition: positionMap[direction[0]],
                            position: getPosition(x, adjustedY, direction),
                            style: { opacity: 1 },
                        };
                    }),
                );

                setEdges((edges) => edges.map((edge) => ({ ...edge, style: { opacity: 1 } })));
            } catch (e) {
                console.error(e);
                console.error("Multiple heads found. Cannot apply automatic layout");
            }
        });

        return () => cancelAnimationFrame(rafId);
    }, [
        nodeCount,
        nodesInitialized,
        getNodes,
        getEdges,
        setNodes,
        setEdges,
        direction,
        nodesAndEdgesUpdated,
    ]);
}

export default useAutoLayout;
