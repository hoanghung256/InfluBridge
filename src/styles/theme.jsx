import { createTheme } from "@mui/material/styles";
import { purple, blue, grey, common } from "@mui/material/colors";

const theme = createTheme({
    cssVariables: true,
    palette: {
        mode: "light",
        primary: {
            light: purple[100],
            main: purple[300], // also primary button color 
            dark: purple[500],
        },
        secondary: {
            light: blue[200],
            main: blue[400], // xanh biển vừa
            dark: blue[600],
            contrastText: "#ffffff",
        },
        background: {
            default: "#fdfdfd",
            paper: "#ffffff",
        },
        divider: grey[300],
        text: {
            primary: grey[900],
            secondary: grey[700],
            light: grey[500],
            dark: common.black,
            disabled: grey[400],
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 600, fontSize: "3rem" },
        h2: { fontWeight: 600, fontSize: "2.25rem" },
        button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 8 },
                containedPrimary: {
                    "&:hover": {
                        backgroundColor: purple[400], // hover tím đậm hơn 1 tone
                    },
                },
                containedSecondary: {
                    "&:hover": {
                        backgroundColor: blue[500], // hover xanh đậm hơn 1 tone
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundImage: `linear-gradient(90deg, ${purple[100]}, ${blue[100]})`,
                },
            },
        },
    },
});

export default theme;
