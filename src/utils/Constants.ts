import { createTheme, responsiveFontSizes } from "@mui/material";

export const defaultTheme = responsiveFontSizes(
    createTheme({
        typography: {
            fontFamily: "'NotoSansKR'",
        },
        palette: {
            background: {
                default: "#EDEDED",
            },
            primary: {
                main: "#279023",
                light: "#5fc152",
                dark: "#006100",
                contrastText: "#ffffff",
            },
            secondary: {
                main: "#4db6ac",
                light: "#82e9de",
                dark: "#00867d",
            },
        },
    })
);