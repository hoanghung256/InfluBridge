import { useEffect, useState, useMemo, useCallback } from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    MenuItem,
    IconButton,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Pagination,
    Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import useConvexUserData from "../../../hooks/useConvexUserData";
import useCategories from "../../../hooks/useCategories";
import { convexQueryOneTime } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";

const PAGE_SIZE = 10;

function CampaignPage() {
    const user = useConvexUserData();
    const brandId = user?.detail?._id || null;
    const { categories = [] } = useCategories() || {};

    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState("");

    const categoryMap = useMemo(
        () =>
            categories.reduce((acc, c) => {
                acc[c._id] = c.name || c.title;
                return acc;
            }, {}),
        [categories],
    );

    const fetchData = useCallback(async () => {
        if (!brandId) return;
        setLoading(true);
        setError("");
        try {
            const res = await convexQueryOneTime(api.functions.campaigns.getCampaignByBrandId, {
                brandId,
                status: status || undefined,
                page,
                pageSize: PAGE_SIZE,
            });
            setCampaigns(res?.data || []);
            setPagination(res?.pagination || null);
        } catch (e) {
            console.error(e);
            setError("Failed to load campaigns.");
        } finally {
            setLoading(false);
        }
    }, [brandId, status, page]);

    useEffect(() => {
        setPage(1); // reset to first page when status changes
    }, [status]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => fetchData();

    if (!brandId) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 2 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6">No brand context.</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Brand ID not found on current user.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, px: 2, pb: 8 }}>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Typography variant="h5" fontWeight={600} flexGrow={1}>
                        Campaigns
                    </Typography>
                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </TextField>
                    <Tooltip title="Refresh">
                        <span>
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {loading && (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <CircularProgress size={36} />
                    </Box>
                )}

                {error && !loading && (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                        <Button sx={{ mt: 1 }} onClick={handleRefresh} size="small">
                            Retry
                        </Button>
                    </Box>
                )}

                {!loading && !error && campaigns.length === 0 && (
                    <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            No campaigns found.
                        </Typography>
                    </Box>
                )}

                <Stack spacing={2}>
                    {campaigns.map((c) => {
                        const period = c.periods || {};
                        const dateFmt = (ts) =>
                            ts ? new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "-";
                        return (
                            <Paper
                                key={c._id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2,
                                }}
                            >
                                <Box flexGrow={1}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {c.title}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={c.status || "open"}
                                            color={
                                                c.status === "open"
                                                    ? "success"
                                                    : c.status === "draft"
                                                      ? "default"
                                                      : "warning"
                                            }
                                            variant="outlined"
                                        />
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        Created {new Date(c._creationTime).toLocaleDateString()}
                                    </Typography>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                                        {(c.categories || []).map((catId) => (
                                            <Chip
                                                key={catId}
                                                size="small"
                                                label={categoryMap[catId] || "Category"}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>

                                    <Typography variant="body2" sx={{ mt: 1.2 }} color="text.secondary">
                                        Apply: {dateFmt(period.apply?.start)} - {dateFmt(period.apply?.end)} | Active:{" "}
                                        {dateFmt(period.active?.start)} - {dateFmt(period.active?.end)}
                                    </Typography>

                                    {c.socialPlatforms?.length > 0 && (
                                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                            {c.socialPlatforms.map((sp) => (
                                                <Chip key={sp} size="small" label={sp} />
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        endIcon={<OpenInNewIcon fontSize="inherit" />}
                                        onClick={() => {
                                            // Placeholder: navigate to a detail page when implemented
                                            // e.g. navigate(`/campaigns/${c._id}`)
                                            alert(`Open campaign detail: ${c._id}`);
                                        }}
                                    >
                                        Detail
                                    </Button>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>

                {pagination && pagination.totalPages > 1 && (
                    <Box mt={3} display="flex" justifyContent="center">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={(_, val) => setPage(val)}
                            size="small"
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default CampaignPage;
