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
    Grid,
    Stack,
    colors,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import useClerkUserData from "../../hooks/useClerkUserData";
import { UserButton } from "@clerk/clerk-react";
import AppIcon from "../../constants/icons";

function GeneralLayout() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <GeneralNavbar />
            <Toolbar />
            <Box component="main" sx={{ flex: 1, position: "relative" }}>
                <Outlet />
                <Footer />
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

function Footer() {
    const year = new Date().getFullYear();
    const column = (title, items) => (
        <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                {title}
            </Typography>
            <Stack spacing={0.75}>
                {items.map((i) => (
                    <Button
                        key={i.label}
                        component={RouterLink}
                        to={i.to || "#"}
                        variant="text"
                        size="small"
                        sx={{
                            justifyContent: "flex-start",
                            color: "text.light",
                            textTransform: "none",
                            px: 0,
                            minWidth: 0,
                            "&:hover": { color: "text.secondary", background: "transparent" },
                        }}
                    >
                        {i.label}
                    </Button>
                ))}
            </Stack>
        </Box>
    );

    return (
        <Box component="footer" sx={{ mt: 8, bgcolor: "#0e1217", color: "grey.300" }}>
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2} maxWidth={320}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AppIcon />
                                <Typography variant="h6" fontWeight={700} color="common.white">
                                    InfluBridge
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="grey.400">
                                The leading platform connecting brands with authentic influencers. Create successful
                                partnerships that drive real results.
                            </Typography>
                            <Stack spacing={1} mt={1}>
                                <Typography variant="body2">hello@influbridge.com</Typography>
                                <Typography variant="body2">+1 (555) 123-4567</Typography>
                                <Typography variant="body2">Đà Nẵng, Việt Nam</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.2} mt={1}>
                                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
                                    <IconButton
                                        key={i}
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.06)",
                                            color: "grey.300",
                                            "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
                                        }}
                                    >
                                        <Icon fontSize="inherit" />
                                    </IconButton>
                                ))}
                            </Stack>
                            <Box mt={3} display={{ xs: "block", md: "none" }}>
                                {column("Legal", [
                                    { label: "Privacy Policy" },
                                    { label: "Terms of Service" },
                                    { label: "Cookie Policy" },
                                    { label: "GDPR" },
                                    { label: "Security" },
                                ])}
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4}>
                            <Grid item xs={6} sm={4}>
                                {column("Platform", [
                                    { label: "For Brands" },
                                    { label: "For Influencers" },
                                    { label: "How It Works" },
                                    { label: "Pricing" },
                                    { label: "Features" },
                                ])}
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                {column("Resources", [
                                    { label: "Blog" },
                                    { label: "Case Studies" },
                                    { label: "Help Center" },
                                    { label: "API Docs" },
                                    { label: "Webinars" },
                                ])}
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                {column("Company", [
                                    { label: "About Us", to: "/about-us" },
                                    { label: "Careers" },
                                    { label: "Press" },
                                    { label: "Contact" },
                                    { label: "Partners" },
                                ])}
                            </Grid>
                            <Grid item xs={6} sm={4} display={{ xs: "none", md: "block" }}>
                                {column("Legal", [
                                    { label: "Privacy Policy" },
                                    { label: "Terms of Service" },
                                    { label: "Cookie Policy" },
                                    { label: "GDPR" },
                                    { label: "Security" },
                                ])}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 6, mb: 3, borderColor: "rgba(255,255,255,0.08)" }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                >
                    <Typography variant="caption" color="grey.500">
                        © {year} InfluBridge. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                        {["Status", "Sitemap", "Accessibility"].map((item) => (
                            <Typography
                                key={item}
                                variant="caption"
                                sx={{ cursor: "pointer", color: "grey.500", "&:hover": { color: "grey.300" } }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Box>
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
