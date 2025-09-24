import AboutUsPage from "../../features/general/AboutUsPage";
import CampaignDetailPage from "../../features/general/campaignDetail/CampaignDetailPage";
import LandingPage from "../../features/general/landing/LandingPage";

export const generalRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/campaign/:campaignId", element: <CampaignDetailPage /> },
    { path: "/about-us", element: <AboutUsPage /> },
];
