import { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Stack, Typography, Skeleton, Avatar, Container } from "@mui/material";
import { api } from "../../../convex/_generated/api";
import { convexQueryOneTime } from "../../service/convexClient";
import useCategories from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import InfluencerCard from "./landing/InfluencerCard";

function AllInfluencerPage() {
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
        fetchInfluencers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInfluencers = async () => {
        try {
            setLoading(true);
            const res = await convexQueryOneTime(api.functions.influencers.getFamousInfluencers, { limit: 1000 });
            setInfluencers(Array.isArray(res) ? res : []);
        } finally {
            setLoading(false);
        }
    };

    const skeletons = Array.from({ length: 12 });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Tất cả Influencer
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {loading
                    ? skeletons.map((_, i) => (
                          <Box key={`sk-${i}`} sx={{ flex: "1 1 240px", maxWidth: 320 }}>
                              <Card variant="outlined" sx={{ borderRadius: 2, width: 272 }}>
                                  <CardContent>
                                      <Stack spacing={1.2} alignItems="center">
                                          <Skeleton variant="circular" width={96} height={96} />
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
                          </Box>
                      ))
                    : influencers.map((inf) => (
                          <Box key={inf._id} sx={{ flex: "1 1 240px", maxWidth: 320 }}>
                              <InfluencerCard
                                  influencer={inf}
                                  categoryMap={categoryMap}
                                  isSelf={false}
                                  onClick={() => inf.detail?._id && navigate(`/influencer/${inf.detail._id}`)}
                              />
                          </Box>
                      ))}
            </Box>
        </Container>
    );
}

export default AllInfluencerPage;
