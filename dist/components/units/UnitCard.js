import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import IconByName from "@mat3ra/cove/dist/mui/components/icon";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import s from "underscore.string";
import { InnerContainer, StyledCard } from "./UnitCard.styled";
import { describeUnitMeta, getUnitTypeIconName } from "./unitCardMeta";
import { CardFooter } from "../common/CardFooter";
import { CardHeader } from "../common/CardHeader";
const statusToColorEnum = {
    idle: "default",
    active: "warning",
    error: "error",
    finished: "success",
};
export function UnitCard({ index, unit, actions = [], isSelected = false, isBorder = true, onSelect = () => undefined, animateOnHover = false, isCardContentExpanded = true, showDeveloperInfo = false, showStatus = true, isModified = false, }) {
    var _a, _b, _c, _d;
    const onCardClick = (e) => {
        if (!e.defaultPrevented)
            onSelect(unit);
    };
    const avatarIndex = index > 9 ? `${index}` : `0${index}`;
    const meta = describeUnitMeta(unit);
    // The icon carries the unit's kind alongside the accent stripe, so type is not conveyed by
    // colour alone — which colour-vision deficiency, and a greyscale print, both flatten.
    const metaNode = (_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }, children: [_jsx(IconByName, { name: getUnitTypeIconName(unit.type), sx: (theme) => {
                    var _a, _b;
                    return ({
                        fontSize: 13,
                        flexShrink: 0,
                        color: (_b = (_a = theme.palette.unitTypes) === null || _a === void 0 ? void 0 : _a[String(unit.type)]) !== null && _b !== void 0 ? _b : "text.secondary",
                    });
                } }), _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, children: meta || String((_a = unit.type) !== null && _a !== void 0 ? _a : "") })] }));
    return (_jsx(StyledCard, { id: `card-${s.slugify(unit.name)}`, "data-flowchartid": unit.flowchartId, elevation: 0, isAnimateOnHover: animateOnHover, isBorder: isBorder, onClick: onCardClick, children: _jsxs(InnerContainer, { isSelected: isSelected, type: unit.type, isTypeColor: true, children: [_jsx(CardHeader, { title: unit.name, subheader: unit.flowchartId, avatarIndex: avatarIndex, actions: actions, status: (_b = unit.status) !== null && _b !== void 0 ? _b : "", badgeColor: (_d = statusToColorEnum[(_c = unit.status) !== null && _c !== void 0 ? _c : "idle"]) !== null && _d !== void 0 ? _d : "default", isExpanded: isCardContentExpanded && Boolean(actions.length), contentToCopy: unit.flowchartId, showDeveloperInfo: showDeveloperInfo, showStatus: showStatus, meta: metaNode, isModified: isModified }), isCardContentExpanded && Boolean(actions.length) && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(CardFooter, { actions: actions })] }))] }) }));
}
