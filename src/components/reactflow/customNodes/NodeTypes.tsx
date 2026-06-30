/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import DefaultNode from "./DefaultNode";
import UnitNode from "./UnitNode";

export const nodeTypes = {
    // eslint-disable-next-line react/no-unstable-nested-components
    unitNode: (data) => <UnitNode {...data} />,
    defaultNode: (data) => <DefaultNode {...data} />,
};
