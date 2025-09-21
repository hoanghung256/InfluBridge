import React, { useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
    Fab,
    Zoom,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useClerkUserData from "../../hooks/useClerkUserData";
import { UserButton } from "@clerk/clerk-react";

function GeneralLayout() {
    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <GeneralNavbar />
            {/* Spacer for fixed AppBar */}
            <Toolbar />
            <Box component="main" sx={{ flex: 1, overflow: "auto", position: "relative" }}>
                <Outlet />
                <ScrollTopFab />
            </Box>
        </Box>
    );
}

function GeneralNavbar() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = useState(false);
    const { user } = useClerkUserData();

    const navItems = [
        { label: "Home", to: "/" },
        { label: "Campaigns", to: "/campaigns" },
        { label: "Influencers", to: "/influencers" },
        { label: "About us", to: "/about" },
    ];

    const drawer = (
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 600 }}>
                InfluBridge
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItemButton key={item.to} component={RouterLink} to={item.to}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                {user ? (
                    <UserButton afterSignOutUrl="/" />
                ) : (
                    <>
                        <Button fullWidth variant="contained" size="small" href="/login">
                            Sign In
                        </Button>
                        <Button fullWidth variant="outlined" size="small" href="/sign-up">
                            Get Started
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar elevation={1} color="inherit" position="fixed" sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Toolbar sx={{ gap: 2 }}>
                    {!isMdUp && (
                        <IconButton edge="start" aria-label="menu" onClick={() => setOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        style={{ textDecoration: "none" }}
                        sx={{ fontWeight: 700, color: "text.primary", flexGrow: { xs: 1, md: 0 } }}
                    >
                        InfluBridge
                    </Typography>

                    {isMdUp && (
                        <Box sx={{ display: "flex", gap: 1, ml: 4 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.to}
                                    component={RouterLink}
                                    to={item.to}
                                    color="inherit"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: "flex", gap: 1 }}>
                        {isMdUp && user ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <>
                                <Button component={RouterLink} to="/login" variant="text" size="small">
                                    Sign In
                                </Button>
                                <Button component={RouterLink} to="/sign-up" variant="contained" size="small">
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }}>
                {drawer}
            </Drawer>
        </>
    );
}

function ScrollTopFab() {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 250);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <Zoom in={visible}>
            <Fab
                size="small"
                color="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                sx={{ position: "fixed", bottom: 24, right: 24 }}
                aria-label="scroll back to top"
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
}

export default GeneralLayout;
