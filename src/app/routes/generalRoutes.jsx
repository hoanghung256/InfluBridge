import AboutUsPage from "../../features/general/AboutUsPage";
import CampaignDetailPage from "../../features/general/campaignDetail/CampaignDetailPage";
import LandingPage from "../../features/general/landing/LandingPage";
import ViewOnlyBrandProfilePage from "../../features/profile/ViewOnlyBrandProfilePage";
import ViewOnlyInfluencerProfilePage from "../../features/profile/ViewOnlyInfluencerProfilePage";

export const generalRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/campaign/:campaignId", element: <CampaignDetailPage /> },
    { path: "/about-us", element: <AboutUsPage /> },
    { path: "/influencer/:influencerId", element: <ViewOnlyInfluencerProfilePage /> },
    { path: "/brand/:brandId", element: <ViewOnlyBrandProfilePage /> },
];
