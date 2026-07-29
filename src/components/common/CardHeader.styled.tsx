import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import { styled } from "@mui/material/styles";

type PaletteColorKey = "primary" | "secondary" | "error" | "info" | "success" | "warning";

const paletteMain = (theme: any, color: string | undefined) =>
    theme.palette[color as PaletteColorKey]?.main || theme.palette.grey[600];

export const Subheader = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
}));

export const StyledBadge = styled(Badge, {
    shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: paletteMain(theme, color as string),
        color: theme.palette.common.white,
        fontSize: "12px",
    },
}));

export const StyledAvatar = styled(Avatar, {
    shouldForwardProp: (prop) => prop !== "color" && prop !== "isBadge",
})<{ color?: string; isBadge?: boolean }>(({ theme, color, isBadge }) => ({
    color: !isBadge ? theme.palette.common.white : theme.palette.grey[900],
    fontSize: "18px",
    backgroundColor: !isBadge ? paletteMain(theme, color) : theme.palette.common.white,
    border: isBadge ? "1px solid #000" : "none",
}));

export const ActionContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
});

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    width: "100%",
    // Load-bearing: the pre-extraction 73px height puts the card's geometric center on the
    // neutral CardFooter strip, so center-clicks (Cypress unit selection) hit an area that
    // does not preventDefault - see the onCardClick note in WorkflowUnitCard.tsx.
    height: "73px",
    alignSelf: "center",
    padding: theme.spacing(0, 2),
    boxSizing: "border-box",

    "& .MuiCardHeader-content": {
        width: "135px",
    },

    "& .MuiCardHeader-action": {
        marginTop: 0,
        marginBottom: 0,
        alignSelf: "center",
    },
}));

export const FlowchartIdContainer = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    borderRadius: "4px",
    paddingLeft: theme.spacing(1),
    overflow: "hidden",
}));
