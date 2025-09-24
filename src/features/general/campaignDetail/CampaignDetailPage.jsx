import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convexQueryOneTime } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";
import { Box, Container, Grid, Paper, Stack, Typography, Chip, Divider, Button, Skeleton } from "@mui/material";
import { icons } from "../../../constants/icons";
import FirebaseImg from "../../../components/FirebaseImg/FirebaseImg";

function CampaignDetailPage() {
    const { campaignId } = useParams();

    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        if (campaignId) {
            getCampaignDetail();
        }
    }, []);

    const getCampaignDetail = async () => {
        const res = await convexQueryOneTime(api.functions.campaigns.getCampaignById, { campaignId });
        setCampaign(res);
        console.log("Campaign Detail:", res);
    };

    if (!campaign) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Typography variant="h6" textAlign="center">
                    Không tìm thấy chiến dịch.
                </Typography>
            </Container>
        );
    }

    const fmtRange = (p) => `${fmtDate(p?.start)} - ${fmtDate(p?.end)}`;
    const fmtDate = (ts) =>
        ts ? new Date(ts).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : "--/--";

    const applyCount = campaign.applyCount ?? 0;
    const applyLimit = campaign.applyLimit ?? 0;

    const now = Date.now();
    const apply = campaign.periods?.apply || {};
    const isApplyOpen = apply?.start && apply?.end && now >= apply.start && now <= apply.end;

    return (
        <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} wrap="nowrap">
                    {/* Left content */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: { xs: 2, md: 3 } }}>
                            <Stack spacing={1}>
                                <Typography variant="overline" color="text.secondary">
                                    {campaign.location || "—"}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{
                                        wordWrap: "break-word", // cắt từ dài
                                        overflowWrap: "break-word", // tương thích
                                        whiteSpace: "normal", // cho phép xuống dòng
                                    }}
                                >
                                    {campaign.title}
                                </Typography>

                                {/* Social platforms */}
                                {campaign.socialPlatforms?.length && (
                                    <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                                        {campaign.socialPlatforms.map((sp) => (
                                            <Chip
                                                key={sp}
                                                size="small"
                                                variant="outlined"
                                                label={
                                                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{ display: "flex" }}>{icons[sp]}</span>
                                                        {sp.charAt(0).toUpperCase() + sp.slice(1)}
                                                    </span>
                                                }
                                            />
                                        ))}
                                    </Stack>
                                )}

                                {/* Banner */}
                                <Box
                                    sx={{
                                        mt: 2,
                                        borderRadius: 1,
                                        // overflow: "hidden",
                                        border: (t) => `1px solid ${t.palette.divider}`,
                                    }}
                                >
                                    <FirebaseImg
                                        fileName={campaign.bannerUrl}
                                        alt={campaign.title}
                                        style={{ width: 800, height: 800, objectFit: "contain" }}
                                    />
                                </Box>

                                {/* Categories */}
                                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                                    {(campaign.categories || []).map((cid) => (
                                        <Chip key={cid} label={cid || "Danh mục"} size="small" />
                                    ))}
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                {/* Reward */}
                                <Section title="Phần thưởng">
                                    <Typography variant="body2">
                                        <strong>{campaign.reward}</strong>
                                        {campaign.budget ? ` · Ngân sách: ${campaign.budget}` : ""}
                                    </Typography>
                                </Section>

                                {/* Policy */}
                                <Section title="Điều khoản và điều kiện">
                                    <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                        {campaign.policyAndCondition || "—"}
                                    </Typography>
                                </Section>

                                {/* Guide */}
                                <Section title="Hướng dẫn chiến dịch">
                                    <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                        {campaign.guide || "—"}
                                    </Typography>
                                </Section>

                                {/* Content requirements */}
                                <Section title="Yêu cầu nội dung">
                                    <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                        {campaign.contentRequired || "—"}
                                    </Typography>
                                </Section>

                                {/* Q&A */}
                                <Box mt={1}>
                                    <Button variant="outlined" size="small">
                                        Hỏi về chiến dịch này
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right panel */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 88 }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Tiến trình
                            </Typography>
                            <Stack spacing={1} mb={2}>
                                <PeriodRow label="Ứng tuyển" value={fmtRange(campaign.periods?.apply)} />
                                <PeriodRow label="Chọn lọc" value={fmtRange(campaign.periods?.selective)} />
                                <PeriodRow label="Đăng bài" value={fmtRange(campaign.periods?.active)} />
                                <PeriodRow label="Đánh giá" value={fmtRange(campaign.periods?.review)} />
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Typography variant="body2" color="text.secondary" mb={1}>
                                Ứng tuyển: <strong>{applyCount}</strong>
                                {applyLimit ? ` / ${applyLimit}` : ""}
                            </Typography>

                            <Button
                                fullWidth
                                size="medium"
                                variant="contained"
                                color="primary"
                                disabled={!isApplyOpen || campaign.status !== "open"}
                                sx={{ mt: 1 }}
                                onClick={() => {
                                    // TODO: navigate to apply/auth flow
                                }}
                            >
                                {campaign.status !== "open"
                                    ? "Đã đóng"
                                    : isApplyOpen
                                      ? "Ứng tuyển"
                                      : "Ngoài thời gian ứng tuyển"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function Section({ title, children }) {
    return (
        <Box sx={{ mt: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {title}
            </Typography>
            {children}
        </Box>
    );
}

function PeriodRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2">{value}</Typography>
        </Stack>
    );
}

export default CampaignDetailPage;
