import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Stack,
    Divider,
    Chip,
    Card,
    CardContent,
} from "@mui/material";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

// Reusable Paper/Card style
const cardStyle = {
    p: 3,
    borderRadius: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

function AboutUsPage() {
    const coreValues = [
        {
            icon: <RocketLaunchOutlinedIcon />,
            title: "Our Mission",
            text: "Empower authentic collaborations between brands and creators through transparent data and streamlined workflows.",
        },
        {
            icon: <Groups2OutlinedIcon />,
            title: "Our Vision",
            text: "Become the most trusted bridge for performance-driven influencer marketing in emerging markets.",
        },
        {
            icon: <FavoriteBorderOutlinedIcon />,
            title: "Our Values",
            text: "Integrity, measurable impact, user empathy, continuous learning, and long-term partnerships.",
        },
    ];

    const team = [
        { name: "Hoàng Vũ Hưng", role: "Founder / CEO", initials: "HVH" },
        { name: "Phạm Thị Phương Nhi", role: "CFO", initials: "PTPN" },
        { name: "Nguyễn Hoàng Dương", role: "CTO", initials: "NHD" },
        { name: "Nguyễn Bá Hoàng", role: "Developer", initials: "NBH" },
        { name: "Hồ Thụy Khánh Vân", role: "Designer", initials: "HLTKV" },
        { name: "Trần Minh Tuấn", role: "Designer", initials: "TMT" },
    ];

    return (
        <Box sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg">
                {/* Hero */}
                <Stack spacing={3} textAlign="center" mb={8}>
                    <Typography variant="overline" color="primary" letterSpacing={1}>
                        ABOUT US
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                        Building the bridge between Brands & Influencers
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mx: "auto" }}>
                        InfluBridge helps marketing teams discover, evaluate, and manage creator collaborations with
                        insight, speed, and confidence.
                    </Typography>
                </Stack>

                {/* Core Values */}
                <Grid container spacing={4} mb={10} justifyContent={"space-between"}>
                    {coreValues.map((v) => (
                        <Grid item key={v.title}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    ...cardStyle,
                                    "& svg": { color: "common.white" },
                                    width: 350,
                                }}
                            >
                                <Box
                                    sx={(theme) => ({
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                    })}
                                >
                                    {v.icon}
                                </Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {v.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {v.text}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Story */}
                <Grid container spacing={6} mb={10} alignItems="center">
                    {/* Left column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight={600} gutterBottom>
                            Our Story
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We started InfluBridge after seeing brands struggle to vet and coordinate creators across
                            multiple fragmented tools...
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We are building a unified operating layer: structured campaign lifecycles, transparent
                            timelines, trackable deliverables, and actionable insights—so both sides focus on creating
                            value.
                        </Typography>
                        <Stack direction="row" spacing={1} mt={2}>
                            {["Transparency", "Data-Driven", "Collaboration"].map((chip) => (
                                <Chip key={chip} label={chip} />
                            ))}
                        </Stack>
                    </Grid>

                    {/* Right column */}
                    <Grid item xs={12} md={6} display="flex" justifyContent="center">
                        <Card
                            variant="outlined"
                            sx={{
                                p: 1,
                                borderRadius: 4,
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Platform Highlights
                                </Typography>
                                <Stack spacing={1.5}>
                                    {[
                                        "End-to-end campaign lifecycle management",
                                        "Structured budget & timeline validation",
                                        "Multi-platform targeting & analytics",
                                        "Category tagging & discovery",
                                        "Secure data and scalable architecture",
                                    ].map((f) => (
                                        <FeatureLine key={f} text={f} />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Team */}
                <Box mb={10}>
                    <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
                        Team
                    </Typography>
                    <Grid container columnSpacing={10} rowSpacing={6} justifyContent="center">
                        {team.map((m) => (
                            <Grid item xs={12} md={6} lg={4} key={m.name}>
                                <Paper variant="outlined" sx={{ ...cardStyle, width: 300 }}>
                                    <Avatar
                                        sx={(theme) => ({
                                            mx: "auto",
                                            width: 72,
                                            height: 72,
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText,
                                            fontWeight: 600,
                                        })}
                                    >
                                        {m.initials}
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight={600} textAlign="center">
                                        {m.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center">
                                        {m.role}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider />

                {/* Footer Callout */}
                <Box textAlign="center" mt={8}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Let's build better creator partnerships.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" maxWidth={640} mx="auto">
                        Join us as we refine tools that bring clarity and performance to brand–influencer collaboration.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

function FeatureLine({ text }) {
    return (
        <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box
                sx={(theme) => ({
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    mt: "7px",
                    flexShrink: 0,
                })}
            />
            <Typography variant="body2" color="text.secondary">
                {text}
            </Typography>
        </Stack>
    );
}

export default AboutUsPage;
