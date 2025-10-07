import { useParams } from "react-router-dom";
import { convexQueryOneTime } from "../../service/convexClient";
import { api } from "../../../convex/_generated/api";
import { useEffect, useMemo, useState } from "react";
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
import { formatVNDCurrency } from "../../utils/currencyFormatter";
import { icons } from "../../constants/icons";
import CategoryChips from "../../components/CategoryChips";

function ViewOnlyBrandProfilePage() {
    const { brandId } = useParams();

    const [brandData, setBrandData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (brandId) getBrandData(brandId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brandId]);

    const getBrandData = async (id) => {
        try {
            setIsLoading(true);
            const res = await convexQueryOneTime(api.functions.brands.getById, { brandId: id });
            setBrandData(res);
        } catch (e) {
            console.error("Failed to fetch brand data:", e);
            setBrandData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const detail = brandData?.detail;
    
    const initials = (name) =>
        (name || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("");

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!brandData || !detail) {
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body1">Không tìm thấy hồ sơ thương hiệu.</Typography>
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
                    alt={brandData.fullname}
                >
                    {detail.avatarUrl ? (
                        <FirebaseImg
                            fileName={detail.avatarUrl}
                            alt={brandData.fullname || "Avatar"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        initials(brandData.fullname)
                    )}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" fontWeight={600}>
                            {detail.brandName || brandData.fullname}
                        </Typography>
                        {brandData.isVerified && (
                            <Tooltip title="Đã xác minh">
                                <Verified color="primary" fontSize="small" />
                            </Tooltip>
                        )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {brandData.email && `📧 ${brandData.email}`} {brandData.phone && `• 📱 ${brandData.phone}`}
                    </Typography>

                    <Typography sx={{ mt: 1.5 }}>
                        <strong>Ngân sách:</strong>{" "}
                        <Typography component="span" color="primary.main" fontWeight={600}>
                            {formatVNDCurrency(detail.budgetMin)} - {formatVNDCurrency(detail.budgetMax)}
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
                    {detail.description || "Chưa có mô tả."}
                </Typography>
            </Paper>

            {/* Description */}
            <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Mô tả chi tiết
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                    {detail.description || "Chưa có mô tả chi tiết."}
                </Typography>
            </Paper>

            {/* Categories */}
            <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Danh mục
                </Typography>
                <CategoryChips categoryIds={detail.categories} />
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

export default ViewOnlyBrandProfilePage;
