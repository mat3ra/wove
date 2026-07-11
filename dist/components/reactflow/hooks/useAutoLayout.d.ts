import { Direction } from "../../units/types";
export type Options = {
    direction: Direction;
    nodesAndEdgesUpdated: boolean;
};
declare function useAutoLayout(options: Options): void;
export default useAutoLayout;
