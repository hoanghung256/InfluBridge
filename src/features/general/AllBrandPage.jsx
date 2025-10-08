import { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Stack, Typography, Skeleton, Container, Chip, Avatar } from "@mui/material";
import { api } from "../../../convex/_generated/api";
import { convexQueryOneTime } from "../../service/convexClient";
import useCategories from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import FirebaseImg from "../../components/FirebaseImg/FirebaseImg";

function BrandCard({ brand, categoryMap, onClick }) {
    const avatarFile = brand?.detail?.avatarUrl;
    const displayName = brand?.detail?.brandName || brand?.fullname || brand?.email;
    const cats = brand?.detail?.categories || [];
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, width: 272, cursor: "pointer" }} onClick={onClick}>
            <CardContent>
                <Stack spacing={1.2} alignItems="center">
                    {avatarFile ? (
                        <FirebaseImg fileName={avatarFile} width={96} height={96} inputClassName="rounded-circle" />
                    ) : (
                        <Avatar sx={{ width: 96, height: 96 }}>{(displayName || "").slice(0, 1)}</Avatar>
                    )}
                    <Typography variant="subtitle1" fontWeight={700} textAlign="center">
                        {displayName}
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center" width="100%">
                        {cats.slice(0, 4).map((cid) => (
                            <Chip key={cid} label={categoryMap[cid] || "Unknown"} size="small" />
                        ))}
                        {cats.length > 4 && <Chip label={`+${cats.length - 4}`} size="small" />}
                    </Stack>
                    {(brand?.detail?.budgetMin ?? null) !== null && (brand?.detail?.budgetMax ?? null) !== null && (
                        <Typography variant="body2" color="text.secondary">
                            Budget: {brand.detail.budgetMin.toLocaleString()} -{" "}
                            {brand.detail.budgetMax.toLocaleString()}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

function AllBrandPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const { categories: allCategories = [] } = useCategories();
    const navigate = useNavigate();

    const categoryMap = useMemo(() => {
        const m = {};
        (allCategories || []).forEach((c) => (m[c._id] = c.name || c.title));
        return m;
    }, [allCategories]);

    useEffect(() => {
        fetchBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const res = await convexQueryOneTime(api.functions.brands.getAll, { limit: 1000 });
            setBrands(Array.isArray(res) ? res : []);
        } finally {
            setLoading(false);
        }
    };

    const skeletons = Array.from({ length: 12 });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Tất cả Brand
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
                    : brands.map((b) => (
                          <Box key={b._id} sx={{ flex: "1 1 240px", maxWidth: 320 }}>
                              <BrandCard
                                  brand={b}
                                  categoryMap={categoryMap}
                                  onClick={() => b.detail?._id && navigate(`/brand/${b.detail._id}`)}
                              />
                          </Box>
                      ))}
            </Box>
        </Container>
    );
}

export default AllBrandPage;
