import { Outlet } from "react-router-dom";
import { Toolbar, Box } from "@mui/material";

import GeneralNavbar from "./GeneralNavbar";
import GeneralFooter from "./GeneralFooter";
import ScrollTopFab from "../../components/ScrollTopFab";

function GeneralLayout() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <GeneralNavbar />
            <Toolbar />
            <Box
                component="main"
                sx={(theme) => ({
                    flex: 1,
                    position: "relative",
                    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                })}
            >
                <Outlet />
                <GeneralFooter />
                <ScrollTopFab />
            </Box>
        </Box>
    );
}

export default GeneralLayout;
