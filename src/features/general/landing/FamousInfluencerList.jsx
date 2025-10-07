import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Card, CardContent, Stack, Typography, Chip, Skeleton, Avatar } from "@mui/material";
import { api } from "../../../../convex/_generated/api";
import { convexQueryOneTime } from "../../../service/convexClient";
import useCategories from "../../../hooks/useCategories";
import FireBaseImg from "../../../components/FirebaseImg/FirebaseImg";
import { useNavigate } from "react-router-dom";
import useConvexUserData from "../../../hooks/useConvexUserData";
import { keyframes } from "@emotion/react";

// Animated gradient border
const spin = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

function FamousInfluencerList() {
    const user = useConvexUserData();
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { categories: allCategories = [] } = useCategories();
    const navigate = useNavigate();

    const categoryMap = useMemo(() => {
        const m = {};
        (allCategories || []).forEach((c) => (m[c._id] = c.name || c.title));
        return m;
    }, [allCategories]);

    useEffect(() => {
        fetchFamousInfluencers();
    }, []);

    const fetchFamousInfluencers = async () => {
        try {
            setLoading(true);
            const res = await convexQueryOneTime(api.functions.influencers.getFamousInfluencers, { limit: 4 });
            setInfluencers(Array.isArray(res) ? res : []);
        } finally {
            setLoading(false);
        }
    };

    const skeletons = Array.from({ length: 4 });

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4} justifyContent="center">
                {loading
                    ? skeletons.map((_, i) => (
                          <Grid item xs={12} sm={6} md={3} key={`sk-${i}`}>
                              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                  <CardContent>
                                      <Stack spacing={1.2} alignItems="center">
                                          <Skeleton variant="circular" width={72} height={72} />
                                          <Skeleton width="80%" />
                                          <Stack
                                              direction="row"
                                              spacing={0.5}
                                              flexWrap="wrap"
                                              justifyContent="center"
                                              width="100%"
                                          >
                                              <Skeleton variant="rounded" width={70} height={24} />
                                              <Skeleton variant="rounded" width={70} height={24} />
                                          </Stack>
                                      </Stack>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))
                    : influencers.map((inf) => {
                          const fullname = inf.fullname || inf.influencerDetail?.fullname || "Influencer";
                          const avatarUrl =
                              inf.avatarUrl || inf.influencerDetail?.avatarUrl || inf.detail?.avatarUrl || "";
                          const catIds = inf.categories || inf.detail?.categories || inf.influencer?.categories || [];
                          const catNames = (catIds || []).map((id) => categoryMap[id] || "Danh mục");
                          const infEmail = inf.email || inf.influencerDetail?.email || "";
                          const isSelf = (user?.email || "").toLowerCase() === (infEmail || "").toLowerCase();

                          return (
                              <Grid item xs={12} sm={6} md={3} key={inf._id}>
                                  <Card
                                      onClick={() => navigate(`/influencer/${inf.detail._id}`)}
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
                                              // Animated gradient ring using a masked ::before layer
                                              "&::before": {
                                                  content: '""',
                                                  position: "absolute",
                                                  inset: 0,
                                                  borderRadius: 2,
                                                  padding: "3px",
                                                  background:
                                                      "linear-gradient(270deg, #7C4DFF, #03A9F4, #00E676, #FFEB3B, #FF5722, #7C4DFF)",
                                                  backgroundSize: "400% 400%",
                                                  WebkitMask:
                                                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                                                  WebkitMaskComposite: "xor",
                                                  maskComposite: "exclude",
                                                  animation: `${spin} 6s ease infinite`,
                                              },

                                              // Ensure content is above the ::before layer
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
                                                  <FireBaseImg
                                                      fileName={avatarUrl}
                                                      width={200}
                                                      height={200}
                                                      inputClassName="rounded-circle"
                                                  />
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
                                                          <Chip key={`${inf._id}-${i}`} size="small" label={c} />
                                                      ))}
                                                      {catNames.length > 4 && (
                                                          <Chip
                                                              size="small"
                                                              variant="outlined"
                                                              label={`+${catNames.length - 4}`}
                                                          />
                                                      )}
                                                  </Stack>
                                              )}
                                          </Stack>
                                      </CardContent>
                                  </Card>
                              </Grid>
                          );
                      })}
            </Grid>
        </Box>
    );
}

export default FamousInfluencerList;
