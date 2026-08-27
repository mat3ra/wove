import { createTheme, type Theme } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

/**
 * Theme for the standalone bundle. Host apps pass their own through MUI's `ThemeProvider`; this
 * one only has to look right on the demo page and inside a notebook output cell.
 */
export function createWoveTheme(mode: ThemeMode = "dark"): Theme {
    return createTheme({
        palette: {
            mode,
            primary: { main: "#7c4dff" },
            secondary: { main: "#00e5ff" },
            ...(mode === "dark"
                ? { background: { default: "#0d1117", paper: "#161b22" } }
                : { background: { default: "#f6f8fa", paper: "#ffffff" } }),
        },
    });
}
