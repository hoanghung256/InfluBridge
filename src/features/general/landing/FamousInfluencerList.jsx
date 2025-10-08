import { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";
import { api } from "../../../../convex/_generated/api";
import { convexQueryOneTime } from "../../../service/convexClient";
import useCategories from "../../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import useConvexUserData from "../../../hooks/useConvexUserData";
import { keyframes } from "@emotion/react";
import InfluencerCard from "./InfluencerCard";

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
                          const infEmail = inf.email || inf.influencerDetail?.email || "";
                          const isSelf = (user?.email || "").toLowerCase() === (infEmail || "").toLowerCase();
                          const detailId = inf.detail?._id;

                          return (
                              <Grid item xs={12} sm={6} md={3} key={inf._id}>
                                  <InfluencerCard
                                      influencer={inf}
                                      categoryMap={categoryMap}
                                      isSelf={isSelf}
                                      onClick={() => detailId && navigate(`/influencer/${detailId}`)}
                                  />
                              </Grid>
                          );
                      })}
            </Grid>
        </Box>
    );
}

export default FamousInfluencerList;
