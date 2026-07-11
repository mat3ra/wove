import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import { type Edge as UnitFlowEdge, Action, Direction } from "../../units/types";
interface Props {
    units: AnySubworkflowUnitSchema[];
    direction: Direction;
    unitIndex: number;
    onUnitSelect: (unit: AnySubworkflowUnitSchema) => void;
    areUnitsExpanded: boolean;
    getActions: (unit: AnySubworkflowUnitSchema, index: number) => Action[];
}
export declare function transformUnitsToNodesAndEdges(props: Props): {
    nodes: import("../../units/types").Node[];
    edges: UnitFlowEdge[];
};
export {};
