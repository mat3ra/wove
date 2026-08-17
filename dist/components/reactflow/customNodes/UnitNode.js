import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Handle } from "reactflow";
import { UnitCard } from "../../units/UnitCard";
import { useNodeData } from "../hooks/useNodeData";
const CardContainer = styled(Box)(() => ({
    maxWidth: "320px",
    minWidth: "200px",
    width: "100%",
}));
function UnitNode(props) {
    const { data } = props;
    const { index, isCardContentExpanded, unit, isSelected, onSelect, actions, animateOnHover, sourcePosition, targetPosition, sourceHandleStyles, sourceHandleLabels, showDeveloperInfo, showStatus, } = useNodeData(data);
    return (_jsxs(CardContainer, { children: [_jsx(Handle, { type: "target", position: targetPosition }), _jsx(UnitCard, { index: index, isCardContentExpanded: isCardContentExpanded, unit: unit, isSelected: isSelected, onSelect: (unit) => onSelect(unit), actions: actions, animateOnHover: animateOnHover, showDeveloperInfo: showDeveloperInfo, showStatus: showStatus }), sourceHandleStyles.map((style, i) => (_jsx(Handle
            // eslint-disable-next-line react/no-array-index-key
            , { type: "source", position: sourcePosition, style: style, id: sourceHandleLabels === null || sourceHandleLabels === void 0 ? void 0 : sourceHandleLabels[i] }, i)))] }));
}
export default UnitNode;
