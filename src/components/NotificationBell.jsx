import { useMemo, useState } from "react";
import {
    Badge,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Popover,
    Stack,
    Tooltip,
    Typography,
    Button,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CheckIcon from "@mui/icons-material/Check";
import useConvexUserData from "../hooks/useConvexUserData";
import { convexMutation, convexQueryRealtime } from "../service/convexClient";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

function formatTime(ts) {
    try {
        return new Date(ts).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        });
    } catch {
        return "";
    }
}

export default function NotificationBell() {
    const user = useConvexUserData();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const list = convexQueryRealtime(
        api.functions.notifications.listByUser,
        user?._id ? { userId: user._id, unreadOnly: false } : "skip",
    );

    const loading = user?._id && list === undefined; // useQuery returns undefined while loading

    const unreadCount = useMemo(() => (Array.isArray(list) ? list.filter((n) => !n.read).length : 0), [list]);

    if (!user?._id) return null;

    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const onItemClick = async (n) => {
        // mark read
        try {
            if (!n.read) await convexMutation(api.functions.notifications.markRead, { notificationId: n._id });
        } catch (e) {
            console.error("markRead failed", e);
        }
        // navigate by meta if available
        if (n?.meta?.campaignId) {
            navigate(`/campaign/${n.meta.campaignId}`);
            handleClose();
        }
    };

    const markAllRead = async () => {
        const unread = (list || []).filter((n) => !n.read);
        await Promise.all(
            unread.map((n) => convexMutation(api.functions.notifications.markRead, { notificationId: n._id })),
        );
    };

    return (
        <>
            <Tooltip title={loading ? "Đang tải..." : unreadCount ? `${unreadCount} thông báo mới` : "Thông báo"}>
                <span>
                    <IconButton color="inherit" onClick={handleOpen} disabled={loading} aria-label="notifications">
                        <Badge badgeContent={unreadCount} color="error">
                            {loading ? <CircularProgress size={18} /> : <NotificationsNoneIcon />}
                        </Badge>
                    </IconButton>
                </span>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { width: 360, maxWidth: "calc(100vw - 24px)" } }}
            >
                <Box sx={{ p: 1.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight={700}>
                            Thông báo
                        </Typography>
                        <Button size="small" startIcon={<CheckIcon />} onClick={markAllRead} disabled={!unreadCount}>
                            Đánh dấu đã đọc
                        </Button>
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {Array.isArray(list) && list.length > 0 ? (
                        <List disablePadding>
                            {list.map((n) => (
                                <ListItemButton key={n._id} onClick={() => onItemClick(n)} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    sx={{ color: n.read ? "text.secondary" : "text.primary" }}
                                                >
                                                    {n.title || "Thông báo"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTime(n._creationTime)}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                    color: n.read ? "text.secondary" : "text.primary",
                                                }}
                                            >
                                                {n.message}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Không có thông báo.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Popover>
        </>
    );
}
