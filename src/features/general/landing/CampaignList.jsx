import { useEffect, useState } from "react";
import { convexQueryOneTime } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";
import Campaign from "./Campaign";

import { Box, Grid, Button, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function CampaignList({ action = "new" }) {
    const [campaigns, setCampaigns] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        loadMoreCampaigns();
    }, []);

    const loadMoreCampaigns = async () => {
        if (isDone) return;

        setLoading(true);
        const res = await convexQueryOneTime(
            api.functions.campaigns.getCampaignsGeneral,
            cursor ? { action: action, cursor, limit: 4 } : { action: action, limit: 4 },
        );

        setCampaigns((prev) => [...prev, ...res.data]);
        setCursor(res.cursor);
        setIsDone(res.isDone);
        setLoading(false);
    };

    return (
        <>
            <Grid container spacing={3} sx={{ px: 6 }}>
                {campaigns?.map((c) => (
                    <Grid item key={c._id}>
                        <Campaign data={c} />
                    </Grid>
                ))}
            </Grid>

            {!isDone && (
                <Box mt={4} display="flex" justifyContent="center">
                    <Button
                        onClick={loadMoreCampaigns}
                        variant="contained"
                        disabled={loading}
                        sx={{ px: 4, py: 1.5, borderRadius: 1, width: "30%" }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Xem thêm"}
                        <KeyboardArrowDownIcon />
                    </Button>
                </Box>
            )}
        </>
    );
}

export default CampaignList;
