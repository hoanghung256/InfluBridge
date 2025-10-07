import { useParams } from "react-router-dom";
import { convexQueryOneTime } from "../../service/convexClient";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Stack,
    Avatar,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Verified } from "@mui/icons-material";
import FirebaseImg from "../../components/FirebaseImg/FirebaseImg";
import useCategories from "../../hooks/useCategories";
import { formatVNDCurrency } from "../../utils/currencyFormatter";
import { icons } from "../../constants/icons";

function ViewOnlyInfluencerProfilePage() {
    const { influencerId } = useParams();
    const { categories } = useCategories();

    const [influencerData, setInfluencerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (influencerId) getInfluencerData(influencerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [influencerId]);

    const getInfluencerData = async (id) => {
        try {
            setIsLoading(true);
            const res = await convexQueryOneTime(api.functions.influencers.getById, { influencerId: id });
            setInfluencerData(res);
        } catch (e) {
            console.error("Failed to fetch influencer data:", e);
            setInfluencerData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const detail = influencerData?.detail;

    const categoryNameById = useMemo(() => {
        const map = {};
        (categories || []).forEach((c) => {
            map[c._id || c.id] = c.name || c.title || "";
        });
        return map;
    }, [categories]);

    const initials = (name) =>
        (name || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("");

    const getPlatformIcon = (platform) => {
        // switch (platform?.toLowerCase()) {
        //     case "facebook":
        //         return <Facebook fontSize="small" />;
        //     case "youtube":
        //         return <YouTube fontSize="small" />;
        //     case "instagram":
        //         return <Instagram fontSize="small" />;
        //     case "tiktok":
        //         return <TikTok fontSize="small" />;
        //     default:
        //         return <LinkIcon fontSize="small" />;
        // }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!influencerData || !detail) {
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body1">Không tìm thấy hồ sơ influencer.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: "auto" }}>
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar
                    sx={{
                        width: 96,
                        height: 96,
                        bgcolor: "#f5f5f5",
                        fontSize: 28,
                        flexShrink: 0,
                        border: "1px solid #eee",
                    }}
                    alt={influencerData.fullname}
                >
                    {detail.avatarUrl ? (
                        <FirebaseImg
                            fileName={detail.avatarUrl}
                            alt={influencerData.fullname || "Avatar"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        initials(influencerData.fullname)
                    )}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" fontWeight={600}>
                            {influencerData.fullname}
                        </Typography>
                        {influencerData.isVerified && (
                            <Tooltip title="Đã xác minh">
                                <Verified color="primary" fontSize="small" />
                            </Tooltip>
                        )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {influencerData.email && `📧 ${influencerData.email}`}{" "}
                        {influencerData.phone && `• 📱 ${influencerData.phone}`}
                    </Typography>

                    <Typography sx={{ mt: 1.5 }}>
                        <strong>Mức giá:</strong>{" "}
                        <Typography component="span" color="primary.main" fontWeight={600}>
                            {formatVNDCurrency(detail.priceMin)} - {formatVNDCurrency(detail.priceMax)}
                        </Typography>
                    </Typography>
                </Box>
            </Paper>

            {/* Bio */}
            <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Giới thiệu
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                    {detail.bio || "Chưa có mô tả."}
                </Typography>
            </Paper>

            {/* Categories */}
            <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Danh mục
                </Typography>
                {Array.isArray(detail.categories) && detail.categories.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {detail.categories.map((catId) => {
                            const name = categoryNameById[catId] || catId;
                            return <Chip key={catId} label={name} variant="outlined" color="primary" size="small" />;
                        })}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Chưa có danh mục.
                    </Typography>
                )}
            </Paper>

            {/* Social channels */}
            <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Kênh mạng xã hội
                </Typography>
                {Array.isArray(detail.socialChannel) && detail.socialChannel.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1.5}>
                        {detail.socialChannel.map((ch, idx) => (
                            <Tooltip key={idx} title={ch.platform || "Link"}>
                                <IconButton
                                    component="a"
                                    href={ch.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    size="medium"
                                    sx={{
                                        bgcolor: "#f8f9fa",
                                        border: "1px solid #e0e0e0",
                                        "&:hover": { bgcolor: "primary.light", color: "white" },
                                    }}
                                >
                                    {icons[ch.platform]}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Chưa liên kết kênh nào.
                    </Typography>
                )}
            </Paper>

            <Divider sx={{ mt: 5, mb: 2 }} />

            <Typography variant="caption" color="text.secondary" align="center" display="block">
                © 2025 Influencer Connect. Tất cả các quyền được bảo lưu.
            </Typography>
        </Box>
    );
}

export default ViewOnlyInfluencerProfilePage;
