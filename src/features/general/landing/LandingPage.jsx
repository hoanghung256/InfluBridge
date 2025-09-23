import { Box, Typography } from "@mui/material";
import LandingBanner from "../../../assets/images/landing-banner.png";
import CampaignList from "./CampaignList";

function LandingPage() {
    return (
        <Box>
            <img width="100%" height="50%" src={LandingBanner} alt="Landing Banner" />
            <Box sx={{ px: 4, py: 6 }}>
                <Typography variant="h5" fontWeight={600} mb={4}>
                    ✨ Chiến dịch mới
                </Typography>
                <CampaignList action="new" />
            </Box>

            <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} mb={4}>
                    ✨ Chiến dịch nổi bật
                </Typography>
                <CampaignList action="trending" />
            </Box>
        </Box>
    );
}

export default LandingPage;
