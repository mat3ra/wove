import { jsx as _jsx } from "react/jsx-runtime";
import DefaultNode from "./DefaultNode";
import UnitNode from "./UnitNode";
export const nodeTypes = {
    // eslint-disable-next-line react/no-unstable-nested-components
    unitNode: (data) => _jsx(UnitNode, { data: data.data, ...data }),
    defaultNode: (data) => _jsx(DefaultNode, { data: data.data, ...data }),
};
