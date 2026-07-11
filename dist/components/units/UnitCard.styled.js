import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
export const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "isAnimateOnHover" && prop !== "isBorder",
})(({ theme, isAnimateOnHover, isBorder }) => {
    var _a;
    return ({
        width: "100%",
        cursor: "pointer",
        border: isBorder ? `1px solid ${((_a = theme.palette.border) === null || _a === void 0 ? void 0 : _a.dark) || "#cecece"}` : "none",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: isAnimateOnHover
            ? ".3s transform cubic-bezier(.155,1.105,.295,1.12),.3s box-shadow,.3s -webkit-transform cubic-bezier(.155,1.105,.295,1.12);"
            : undefined,
        "&:hover": isAnimateOnHover
            ? {
                transform: "scale(1.05)",
                boxShadow: "0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)",
            }
            : undefined,
    });
});
export const InnerContainer = styled("div")(({ theme, type = "", isSelected, isTypeColor }) => {
    const { palette } = theme;
    const { unitTypes } = palette;
    return {
        border: isSelected ? `4px solid ${palette.primary.dark}` : "4px solid white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        "&:before": {
            minWidth: 10,
            content: isTypeColor ? '""' : "none",
            display: "block",
            backgroundColor: type === "error" ? palette.error.main : (unitTypes === null || unitTypes === void 0 ? void 0 : unitTypes[type]) || palette.grey[600],
            height: "101%",
            position: "absolute",
            top: "-1px",
            left: "-1px",
            borderRadius: "4px 0 0 4px",
        },
    };
});
