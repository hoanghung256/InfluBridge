import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Stack,
    Typography,
    Chip,
    Avatar,
    Button,
    IconButton,
    TextField,
    MenuItem,
    InputAdornment,
    Grid,
    Skeleton,
    Tooltip,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CategoryIcon from "@mui/icons-material/Category";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { api } from "../../../convex/_generated/api";
import { convexQueryOneTime, convexMutation } from "../../service/convexClient";
import { CAMPAIGN_STATUS_OPTIONS, CAMPAIGN_STATUSES } from "../../constants/common";
import useCategories from "../../hooks/useCategories";
import { formatVNDCurrency } from "../../utils/currencyFormatter";
import FirebaseImg from "../../components/FirebaseImg/FirebaseImg";

function CampaignAppliesPage() {
    const { campaignId } = useParams();
    const { categories: allCategories = [] } = useCategories();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const statusValues = useMemo(() => {
        const vals = CAMPAIGN_STATUSES ? Object.values(CAMPAIGN_STATUSES) : [];
        return vals.length ? vals : ["applied", "invited", "approved", "rejected"];
    }, []);
    const [status, setStatus] = useState("all");
    const [q, setQ] = useState("");
    const [sort, setSort] = useState("recent"); // recent|priceAsc|priceDesc
    const [updatingId, setUpdatingId] = useState(null);

    const categoryMap = useMemo(() => {
        const map = {};
        (allCategories || []).forEach((c) => (map[c._id] = c.name || c.title));
        return map;
    }, [allCategories]);

    useEffect(() => {
        if (!campaignId) return;
        getApplications();
    }, [campaignId, status]);

    const getApplications = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await convexQueryOneTime(api.functions.campaignApplications.getApplicationsGeneral, {
                campaignId,
                status: status === "all" ? undefined : status,
            });
            setApplications(res || []);
        } catch (e) {
            setError("Không tải được danh sách ứng tuyển.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        let list = applications;
        if (keyword) {
            list = list.filter((a) => {
                const name = a.influencerDetail?.fullname?.toLowerCase() || "";
                const email = a.influencerDetail?.email?.toLowerCase() || "";
                return name.includes(keyword) || email.includes(keyword);
            });
        }
        if (sort === "priceAsc") {
            list = [...list].sort((a, b) => (a.influencer?.priceMin || 0) - (b.influencer?.priceMin || 0));
        } else if (sort === "priceDesc") {
            list = [...list].sort((a, b) => (b.influencer?.priceMax || 0) - (a.influencer?.priceMax || 0));
        } else {
            list = [...list].sort((a, b) => b._creationTime - a._creationTime);
        }
        return list;
    }, [applications, q, sort]);

    // Call backend to update status, then optimistically remove row from current list
    const handleUpdateStatus = async (
        influencerId,
        nextStatus /* 'applied' | 'invited' | 'accepted' | 'rejected' */,
    ) => {
        if (!campaignId || !influencerId) return;
        try {
            setUpdatingId(influencerId);
            await convexMutation(api.functions.campaignApplications.updateApplicationStatus, {
                campaignId,
                influencerId,
                status: nextStatus,
            });
            // Since current view was fetched by `status`, remove the updated app from list
            setStatus("all"); // reset filter to show all
            await getApplications();
        } catch (e) {
            console.error(e);
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack spacing={0.4}>
                            <Typography variant="h5" fontWeight={700}>
                                Đơn ứng tuyển
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Chiến dịch: {campaignId}
                            </Typography>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                            <TextField
                                size="small"
                                select
                                label="Trạng thái"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                sx={{ minWidth: 160 }}
                            >
                                <MenuItem key="all" value="all">
                                    Tất cả
                                </MenuItem>
                                {statusValues.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {CAMPAIGN_STATUS_OPTIONS[s.toUpperCase()]?.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                size="small"
                                label="Tìm kiếm"
                                placeholder="Tên hoặc email"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: 220 }}
                            />

                            <TextField
                                size="small"
                                select
                                label="Sắp xếp"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                sx={{ minWidth: 160 }}
                            >
                                <MenuItem value="recent">Mới nhất</MenuItem>
                                <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                                <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                </Paper>

                {loading ? (
                    <Grid container spacing={2}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid key={i} item xs={12}>
                                <Paper sx={{ p: 2, borderRadius: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Skeleton variant="circular" width={48} height={48} />
                                        <Box sx={{ flex: 1 }}>
                                            <Skeleton width="30%" />
                                            <Skeleton width="18%" />
                                        </Box>
                                        <Skeleton variant="rounded" width={120} height={32} />
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : error ? (
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    </Paper>
                ) : filtered.length === 0 ? (
                    <Paper sx={{ p: 6, borderRadius: 3, textAlign: "center" }}>
                        <PersonSearchIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                            Không có đơn ứng tuyển nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Hãy quay lại sau khi có thêm ứng viên.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1.5}>
                        {filtered.map((app) => (
                            <ApplicationRow
                                key={app._id}
                                app={app}
                                categoryMap={categoryMap}
                                onUpdateStatus={handleUpdateStatus}
                                updating={updatingId === app.influencerId}
                            />
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}

function ApplicationRow({ app, categoryMap, onUpdateStatus, updating }) {
    const name = app.influencerDetail?.fullname || "Người dùng";
    const email = app.influencerDetail?.email || "";
    const phone = app.influencerDetail?.phone || "";
    const cats = app.influencer?.categories || [];
    const priceMin = app.influencer?.priceMin || 0;
    const priceMax = app.influencer?.priceMax || 0;
    const avatarUrl = app.influencer?.avatarUrl || "";

    const initials = getInitials(name);
    const [menuEl, setMenuEl] = useState(null);
    const openMenu = (e) => setMenuEl(e.currentTarget);
    const closeMenu = () => setMenuEl(null);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 2,
                transition: "border-color .2s, background .2s",
                "&:hover": { borderColor: "primary.main", background: "action.hover" },
            }}
        >
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                {avatarUrl ? (
                    <FirebaseImg fileName={avatarUrl} width={100} height={100} inputClassName={"rounded-circle"} />
                ) : (
                    <Avatar sx={{ width: 48, height: 48, fontWeight: 600 }}>{initials}</Avatar>
                )}

                <Box flex={1} minWidth={0}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                        <Typography variant="subtitle1" fontWeight={700} noWrap title={name}>
                            {name}
                        </Typography>
                        <Chip
                            className={`border border-2 border-${CAMPAIGN_STATUS_OPTIONS[app.status.toUpperCase()]?.color}`}
                            size="small"
                            label={CAMPAIGN_STATUS_OPTIONS[app.status.toUpperCase()]?.label}
                        />
                    </Stack>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        mt={0.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                        {email && (
                            <Typography variant="body2" color="text.secondary" noWrap title={email}>
                                <MailOutlineIcon fontSize="inherit" style={{ verticalAlign: "middle" }} /> {email}
                            </Typography>
                        )}
                        {phone && (
                            <Typography variant="body2" color="text.secondary" noWrap title={phone}>
                                {phone}
                            </Typography>
                        )}
                        <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
                        <Typography variant="body2" color="text.secondary">
                            <PriceChangeIcon fontSize="inherit" style={{ verticalAlign: "middle" }} />{" "}
                            {formatVNDCurrency(priceMin)} — {formatVNDCurrency(priceMax)}
                        </Typography>
                    </Stack>

                    {cats.length > 0 && (
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                            <Chip
                                size="small"
                                icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                                label="Danh mục:"
                                variant="outlined"
                            />
                            {cats.slice(0, 5).map((cid) => (
                                <Chip key={cid} size="small" label={categoryMap[cid] || "—"} />
                            ))}
                            {cats.length > 5 && <Chip size="small" variant="outlined" label={`+${cats.length - 5}`} />}
                        </Stack>
                    )}
                </Box>

                <Stack direction="row" spacing={1.25} alignItems="center">
                    <Tooltip title={email ? "Gửi email" : "Không có email"}>
                        <span>
                            <IconButton
                                size="small"
                                color="primary"
                                disabled={!email}
                                onClick={() => {
                                    if (email) window.open(`mailto:${email}`, "_blank");
                                }}
                            >
                                <MailOutlineIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            // TODO: navigate to influencer profile detail if available
                            // navigate(`/influencers/${app.influencerId}`)
                            alert(`Xem hồ sơ: ${app.influencerId}`);
                        }}
                    >
                        Xem hồ sơ
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        endIcon={<MoreVertIcon />}
                        onClick={openMenu}
                        disabled={updating}
                    >
                        Cập nhật
                    </Button>
                    <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={closeMenu}>
                        {Object.values(CAMPAIGN_STATUS_OPTIONS)
                            .filter((o) => o.value !== app.status)
                            .map((o) => (
                                <MenuItem
                                    key={o.value}
                                    onClick={() => {
                                        closeMenu();
                                        onUpdateStatus?.(app.influencerId, o.value);
                                    }}
                                >
                                    {o.label}
                                </MenuItem>
                            ))}
                    </Menu>
                </Stack>
            </Stack>
        </Paper>
    );
}

function toLabel(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return (parts[0][0] || "").toUpperCase();
    return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

export default CampaignAppliesPage;
