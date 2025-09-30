import { useMemo } from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Rating,
    Stack,
    Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useConvexUserData from "../../hooks/useConvexUserData";
import useCategories from "../../hooks/useCategories";
import { icons } from "../../constants/icons";
import { initialsOf } from "../../utils/helper";

function InfluencerProfilePage() {
    const user = useConvexUserData();
    const { categories: allCategories = [] } = useCategories();

    const profile = user || {};
    const detail = profile?.detail || {};
    const fullName = profile?.fullname || "Influencer";
    const bio = detail?.bio || "Giới thiệu bản thân ngắn gọn sẽ hiển thị tại đây.";
    const priceMin = detail?.priceMin ?? 0;
    const priceMax = detail?.priceMax ?? 0;
    const categoryMap = useMemo(() => {
        const m = {};
        (allCategories || []).forEach((c) => (m[c._id] = c.name || c.title));
        return m;
    }, [allCategories]);

    // Map category ids to display chips
    const categoryNames = (detail?.categories || []).map((id) => categoryMap[id] || "Danh mục");

    // Mock: social links and counts (design placeholders)
    const social = [
        { key: "youtube", label: "YouTube", user: "ishowspeed", followers: "7.8M", connected: true },
        { key: "instagram", label: "Instagram", user: "ishowspeed", followers: "12.3M", connected: true },
        { key: "tiktok", label: "TikTok", user: "ishowspeed", followers: "25.1M", connected: true },
        { key: "facebook", label: "Facebook", user: "", followers: "", connected: false },
    ];

    // Mock stats
    const stats = { applied: 7, pending: 7, rating: 5.0 };

    // Mock media/campaigns/reviews
    const sampleImgs = [
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1603349032579-b83a1f898e87?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    ];
    const sampleCampaigns = [
        {
            id: "c1",
            title: "EA FC 25",
            img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
        },
        {
            id: "c2",
            title: "NBA 2K25",
            img: "https://images.unsplash.com/photo-1529419412593-6c5f176d0b81?q=80&w=1200&auto=format&fit=crop",
        },
        {
            id: "c3",
            title: "Fortnite",
            img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        },
    ];
    const sampleReviews = [
        {
            id: "r1",
            name: "KSI",
            avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=240&auto=format&fit=crop",
            rating: 4.8,
            text: "Làm việc chuyên nghiệp, đúng deadline, nội dung sáng tạo và hiệu quả.",
        },
        {
            id: "r2",
            name: "Kai Cenat",
            avatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
            rating: 4.9,
            text: "Hợp tác vui vẻ, kết quả vượt kỳ vọng. Sẽ tiếp tục làm việc lâu dài.",
        },
    ];

    return (
        <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                {/* Header card */}
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        mb: 3,
                    }}
                    elevation={0}
                    variant="outlined"
                >
                    <Grid container spacing={3}>
                        {/* Profile summary */}
                        <Grid item xs={12} md={7}>
                            <Stack direction="row" spacing={2}>
                                <Avatar
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        fontWeight: 700,
                                        bgcolor: "primary.main",
                                        color: "primary.contrastText",
                                    }}
                                >
                                    {initialsOf(fullName)}
                                </Avatar>
                                <Box flex={1} minWidth={0}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h6" fontWeight={700} noWrap>
                                            {fullName}
                                        </Typography>
                                        <Rating value={stats.rating} precision={0.5} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {stats.rating.toFixed(1)}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                                        {categoryNames.slice(0, 4).map((c, i) => (
                                            <Chip key={c + i} size="small" label={c} />
                                        ))}
                                        {categoryNames.length > 4 && (
                                            <Chip
                                                size="small"
                                                variant="outlined"
                                                label={`+${categoryNames.length - 4}`}
                                            />
                                        )}
                                    </Stack>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                                        {bio}
                                    </Typography>

                                    <Stack direction="row" spacing={3} mt={2}>
                                        <Stat label="Applied campaign" value={stats.applied} />
                                        <Stat label="Pending campaign" value={stats.pending} />
                                    </Stack>
                                </Box>

                                <Stack spacing={1}>
                                    <Button variant="outlined" size="small" startIcon={<EditOutlinedIcon />}>
                                        Edit profile
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Social network */}
                        <Grid item xs={12} md={5}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    p: 2,
                                    height: "100%",
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                                    Social network
                                </Typography>
                                <Stack spacing={1}>
                                    {social.map((s) => (
                                        <SocialRow key={s.key} {...s} />
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid container spacing={3}>
                    {/* Left sidebar (Account/Activity) */}
                    <Grid item xs={12} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                            <Typography variant="subtitle2" fontWeight={700} mb={1}>
                                Account
                            </Typography>
                            <NavItem label="Information" />
                            <NavItem label="Social network" />
                            <NavItem label="Image" />
                            <NavItem label="Edit" />
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} mb={1}>
                                Activity
                            </Typography>
                            <NavItem label="My campaign" count={7} />
                            <NavItem label="Favourite campaign" count={7} />
                            <NavItem label="My reviews" count={7} />
                            <NavItem label="Collaboration" count={7} />
                        </Paper>
                    </Grid>

                    {/* Main content */}
                    <Grid item xs={12} md={9}>
                        {/* Images */}
                        <Section title="Image" action={<Button size="small">More</Button>}>
                            <Grid container spacing={2}>
                                {sampleImgs.map((src, i) => (
                                    <Grid item xs={12} sm={6} md={4} key={i}>
                                        <Box
                                            component="img"
                                            src={src}
                                            alt="feed"
                                            sx={{
                                                width: "100%",
                                                height: 160,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                transition: "transform .3s",
                                                "&:hover": { transform: "scale(1.03)" },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Section>

                        {/* Campaigns */}
                        <Section title="Campaigns" action={<Button size="small">More</Button>}>
                            <Grid container spacing={2}>
                                {sampleCampaigns.map((c) => (
                                    <Grid item xs={12} sm={6} md={4} key={c.id}>
                                        <CampaignCard title={c.title} img={c.img} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Section>

                        {/* Favourite Campaign */}
                        <Section title="Favourite Campaign" action={<Button size="small">More</Button>}>
                            <Grid container spacing={2}>
                                {sampleCampaigns.map((c) => (
                                    <Grid item xs={12} sm={6} md={4} key={`fav-${c.id}`}>
                                        <CampaignCard title={c.title} img={c.img} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Section>

                        {/* Reviews */}
                        <Section title="Reviews">
                            <Stack spacing={2}>
                                {sampleReviews.map((r) => (
                                    <Paper key={r.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Avatar src={r.avatar} />
                                            <Box>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {r.name}
                                                    </Typography>
                                                    <Rating value={r.rating} precision={0.1} readOnly size="small" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {r.rating.toFixed(1)}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {r.text}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </Section>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function Stat({ label, value }) {
    return (
        <Box>
            <Typography variant="h6" fontWeight={700}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
}

function SocialRow({ key: k, label, user, followers, connected }) {
    const IconEl = icons[k];
    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: connected ? "grey.50" : "transparent",
                border: (t) => `1px solid ${connected ? t.palette.divider : "transparent"}`,
            }}
        >
            <Box sx={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {IconEl}
            </Box>
            <Box flex={1} minWidth={0}>
                <Typography variant="body2" noWrap>
                    {label}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {user ? `@${user} · ${followers}` : "Chưa liên kết"}
                </Typography>
            </Box>
            {connected ? (
                <IconButton size="small">
                    <LinkIcon fontSize="small" />
                </IconButton>
            ) : (
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ textTransform: "none" }}
                >
                    Add+
                </Button>
            )}
        </Stack>
    );
}

function CampaignCard({ title, img }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform .25s, box-shadow .25s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
            }}
        >
            <Box
                component="img"
                src={img}
                alt={title}
                sx={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
            />
            <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
}

function Section({ title, action, children }) {
    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight={700}>
                    {title}
                </Typography>
                {action}
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {children}
        </Paper>
    );
}

function NavItem({ label, count }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.75 }}>
            <Typography variant="body2">{label}</Typography>
            {typeof count === "number" && <Chip size="small" variant="outlined" label={count} />}
        </Stack>
    );
}

export default InfluencerProfilePage;
