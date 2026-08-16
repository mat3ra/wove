import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Divider from "@mui/material/Divider";
import s from "underscore.string";
import { InnerContainer, StyledCard } from "./UnitCard.styled";
import { CardFooter } from "../common/CardFooter";
import { CardHeader } from "../common/CardHeader";
const statusToColorEnum = {
    idle: "default",
    active: "warning",
    error: "error",
    finished: "success",
};
export function UnitCard({ index, unit, actions = [], isSelected = false, isBorder = true, onSelect = () => undefined, animateOnHover = false, isCardContentExpanded = true, showDeveloperInfo = false, showStatus = false, }) {
    var _a, _b, _c;
    const onCardClick = (e) => {
        if (!e.defaultPrevented)
            onSelect(unit);
    };
    const avatarIndex = index > 9 ? `${index}` : `0${index}`;
    return (_jsx(StyledCard, { id: `card-${s.slugify(unit.name)}`, "data-flowchartid": unit.flowchartId, elevation: 0, isAnimateOnHover: animateOnHover, isBorder: isBorder, onClick: onCardClick, children: _jsxs(InnerContainer, { isSelected: isSelected, type: unit.type, isTypeColor: true, children: [_jsx(CardHeader, { title: unit.name, subheader: unit.flowchartId, avatarIndex: avatarIndex, actions: actions, status: (_a = unit.status) !== null && _a !== void 0 ? _a : "", badgeColor: (_c = statusToColorEnum[(_b = unit.status) !== null && _b !== void 0 ? _b : "idle"]) !== null && _c !== void 0 ? _c : "default", isExpanded: isCardContentExpanded && Boolean(actions.length), contentToCopy: unit.flowchartId, showDeveloperInfo: showDeveloperInfo, showStatus: showStatus }), isCardContentExpanded && Boolean(actions.length) && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(CardFooter, { actions: actions })] }))] }) }));
}
