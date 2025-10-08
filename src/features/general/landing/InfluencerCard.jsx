import { Card, CardContent, Stack, Typography, Chip, Avatar } from "@mui/material";
import FireBaseImg from "../../../components/FirebaseImg/FirebaseImg";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

function InfluencerCard({ influencer, categoryMap = {}, isSelf = false, onClick }) {
    const fullname = influencer.fullname || influencer.influencerDetail?.fullname || "Influencer";
    const avatarUrl =
        influencer.avatarUrl || influencer.influencerDetail?.avatarUrl || influencer.detail?.avatarUrl || "";
    const catIds = influencer.categories || influencer.detail?.categories || influencer.influencer?.categories || [];
    const catNames = (catIds || []).map((id) => categoryMap[id] || "Danh mục");

    return (
        <Card
            onClick={onClick}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                height: "100%",
                width: "17rem",
                transition: "transform .2s ease, box-shadow .2s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                ...(isSelf && {
                    borderColor: "transparent",
                    boxShadow: 6,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        borderRadius: 2,
                        padding: "3px",
                        background: "linear-gradient(270deg, #7C4DFF, #03A9F4, #00E676, #FFEB3B, #FF5722, #7C4DFF)",
                        backgroundSize: "400% 400%",
                        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        animation: `${spin} 6s ease infinite`,
                    },
                    "& .MuiCardContent-root": {
                        position: "relative",
                        zIndex: 1,
                        bgcolor: "transparent",
                    },
                }),
            }}
        >
            <CardContent>
                <Stack spacing={1.2} alignItems="center" textAlign="center">
                    {avatarUrl ? (
                        <FireBaseImg fileName={avatarUrl} width={200} height={200} inputClassName="rounded-circle" />
                    ) : (
                        <Avatar
                            sx={{
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                overflow: "hidden",
                            }}
                        >
                            {fullname.charAt(0).toUpperCase()}
                        </Avatar>
                    )}

                    <Typography variant="subtitle1" fontWeight={700} noWrap maxWidth="100%">
                        {fullname}
                    </Typography>

                    {catNames.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={0.5}
                            flexWrap="wrap"
                            justifyContent="center"
                            useFlexGap
                            sx={{ rowGap: 0.5, mt: 0.5, maxWidth: "100%" }}
                        >
                            {catNames.slice(0, 4).map((c, i) => (
                                <Chip key={`${influencer._id}-${i}`} size="small" label={c} />
                            ))}
                            {catNames.length > 4 && (
                                <Chip size="small" variant="outlined" label={`+${catNames.length - 4}`} />
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default InfluencerCard;
