import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AppIcon from "../../constants/icons";
import useClerkUserData from "../../hooks/useClerkUserData";
import { UserButton } from "@clerk/clerk-react";

function GeneralNavbar() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = useState(false);
    const { user } = useClerkUserData();

    const navItems = [
        { label: "Campaigns", to: "/campaigns" },
        { label: "Influencers", to: "/" },
        { label: "About us", to: "/about-us" },
    ];

    const drawer = (
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
            <AppIcon />
            <Typography variant="h6" sx={{ p: 2, fontWeight: 600 }}>
                InfluBridge
            </Typography>
            <Divider />
            <List className="">
                {navItems.map((item) => (
                    <ListItemButton key={item.to} component={RouterLink} to={item.to}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                {user ? (
                    <UserButton afterSignOutUrl="/signout-callback" />
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
                    <AppIcon />
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        style={{ textDecoration: "none" }}
                        sx={{ fontWeight: 700, color: "primary.main", flexGrow: { xs: 1, md: 0 } }}
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
                                    color="primary.light"
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
                            <UserButton afterSignOutUrl="/signout-callback" />
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

export default GeneralNavbar;
