import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    IconButton,
    Avatar,
    Stack,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import CampaignIcon from "@mui/icons-material/Campaign";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";

import GeneralNavbar from "./GeneralNavbar";
import GeneralFooter from "./GeneralFooter";
import ScrollTopFab from "../../components/ScrollTopFab";
import useConvexUserData from "../../hooks/useConvexUserData";

const DRAWER_WIDTH = 260;

function BrandLayout() {
    const user = useConvexUserData();
    const brandName = user?.detail?.brandName || user?.detail?.name || "Your Brand";
    const initials = toInitials(brandName);
    const isMdUp = useMediaQuery("(min-width:900px)");
    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMobile = () => setMobileOpen((v) => !v);

    const items = useMemo(
        () => [
            // { label: "Dashboard", icon: <DashboardCustomizeIcon />, to: "/campaigns" },
            { label: "Campaigns", icon: <CampaignIcon />, to: "/campaigns" },
            { label: "Create Campaign", icon: <AddCircleOutlineIcon />, to: "/campaigns/create" },
            { label: "Profile", icon: <AssignmentIndIcon />, to: "/brand/my-profile" },
            { label: "Analytics", icon: <InsightsIcon />, to: "#" },
            { label: "Settings", icon: <SettingsIcon />, to: "#" },
        ],
        [],
    );

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            {/* Top bar from general site */}
            <GeneralNavbar />
            <Toolbar />

            {/* Mobile menu button */}
            {!isMdUp && (
                <Box sx={{ px: 2, py: 1 }}>
                    <IconButton onClick={toggleMobile} aria-label="open menu">
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    // px: { xs: 2, md: 3 },
                    // pb: 6,
                    ml: { md: `${DRAWER_WIDTH}px` },
                    transition: "margin .2s ease",
                }}
            >
                {/* Sidebar */}
                <BrandSidebar
                    openMobile={mobileOpen}
                    onCloseMobile={toggleMobile}
                    items={items}
                    brandName={brandName}
                    initials={initials}
                />
                <Box sx={{ position: "relative", minHeight: "80vh", pt: 3, pb: 6, px: { xs: 2, md: 3 } }}>
                    <Outlet />
                </Box>
                <GeneralFooter />
                <ScrollTopFab />
            </Box>
        </Box>
    );
}

function BrandSidebar({ openMobile, onCloseMobile, items, brandName, initials }) {
    const theme = useTheme();
    const isMdUp = useMediaQuery("(min-width:900px)");
    // AppBar default heights: 56 (xs), 64 (sm and up)
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
    const APP_BAR_HEIGHT = isSmUp ? 64 : 56;

    const content = (
        <Box sx={{ width: DRAWER_WIDTH, height: "100%", display: "flex", flexDirection: "column" }}>
            {/* removed <Toolbar /> because drawer is already offset below AppBar */}
            <Box sx={{ px: 2.5, py: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>
                        {initials}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
                            {brandName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Brand Workspace
                        </Typography>
                    </Box>
                </Stack>
            </Box>
            <Divider />
            <List sx={{ px: 1, py: 0.5 }}>
                {items.map((it) => (
                    <NavItem key={it.to} to={it.to} icon={it.icon} label={it.label} onClick={onCloseMobile} />
                ))}
            </List>
            <Box sx={{ flex: 1 }} />
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    © {new Date().getFullYear()} InfluBridge
                </Typography>
            </Box>
        </Box>
    );

    return isMdUp ? (
        <Drawer
            variant="permanent"
            open
            PaperProps={{
                sx: (t) => ({
                    width: DRAWER_WIDTH,
                    borderRight: `1px solid ${t.palette.divider}`,
                    // place under AppBar
                    top: APP_BAR_HEIGHT,
                    height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
                    zIndex: t.zIndex.appBar - 1,
                }),
            }}
        >
            {content}
        </Drawer>
    ) : (
        <Drawer
            variant="temporary"
            open={openMobile}
            onClose={onCloseMobile}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: DRAWER_WIDTH,
                    // also avoid covering AppBar on mobile
                    top: APP_BAR_HEIGHT,
                    height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
                },
            }}
        >
            {content}
        </Drawer>
    );
}

function NavItem({ to, icon, label, onClick }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const active = pathname === to;

    return (
        <ListItemButton
            onClick={() => {
                navigate(to);
                onClick?.();
            }}
            selected={active}
            sx={{
                mb: 0.5,
                borderRadius: 1.5,
                "&.Mui-selected": {
                    bgcolor: (t) => (t.palette.mode === "light" ? t.palette.action.selected : "rgba(255,255,255,0.08)"),
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
        </ListItemButton>
    );
}

function toInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return (parts[0][0] || "B").toUpperCase();
    return ((parts[0][0] || "B") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

export default BrandLayout;
