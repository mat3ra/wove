/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import DefaultNode from "./DefaultNode";
import UnitNode from "./UnitNode";

export const nodeTypes = {
    // eslint-disable-next-line react/no-unstable-nested-components
    unitNode: (data: Record<string, any>) => <UnitNode data={data.data} {...data} />,
    defaultNode: (data: Record<string, any>) => <DefaultNode data={data.data} {...data} />,
};
