import { useEffect, useMemo, useState } from "react";
import { Box, Container, Paper, Stack, Typography, TextField, IconButton, Chip, Divider } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { convexQueryOneTime } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";
import useConvexUserData from "../../../hooks/useConvexUserData";

function FeedbackViewPage() {
    const user = useConvexUserData();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [q, setQ] = useState("");

    const load = async () => {
        try {
            setLoading(true);
            const data = await convexQueryOneTime(api.functions.feedback.listAll, {});
            setList(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const t = q.trim().toLowerCase();
        if (!t) return list;
        return (list || []).filter((f) =>
            [f.title, f.message, f?.user?.fullname, f?.user?.email]
                .filter(Boolean)
                .some((s) => s.toLowerCase().includes(t)),
        );
    }, [list, q]);

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    Phản hồi người dùng
                </Typography>
                <Stack direction="row" spacing={1}>
                    <TextField
                        size="small"
                        placeholder="Tìm theo tiêu đề, nội dung, người gửi..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        InputProps={{ startAdornment: <SearchIcon fontSize="small" style={{ marginRight: 6 }} /> }}
                    />
                    <IconButton onClick={load} disabled={loading} title="Làm mới">
                        <RefreshIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack spacing={1.5}>
                {(filtered || []).map((f) => (
                    <Paper key={f._id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={0.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight={700}>
                                    {f.title || "(Không có tiêu đề)"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(f._creationTime).toLocaleString("vi-VN")}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {f.message}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip size="small" label={f?.user?.role || "user"} />
                                <Typography variant="body2" color="text.secondary">
                                    {f?.user?.fullname} {f?.user?.email ? `• ${f.user.email}` : ""}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
                {(!filtered || filtered.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
                        Không có phản hồi nào.
                    </Typography>
                )}
            </Stack>
        </Container>
    );
}

export default FeedbackViewPage;
