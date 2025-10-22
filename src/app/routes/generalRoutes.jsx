import ProtectedRoute from "../../components/ProtectedRoute";
import { USER_ROLES } from "../../constants/common";
import AboutUsPage from "../../features/general/AboutUsPage";
import CampaignDetailPage from "../../features/general/campaignDetail/CampaignDetailPage";
import FeedbackForm from "../../features/general/feedback/FeedbackForm";
import LandingPage from "../../features/general/landing/LandingPage";
import ViewOnlyBrandProfilePage from "../../features/profile/ViewOnlyBrandProfilePage";
import ViewOnlyInfluencerProfilePage from "../../features/profile/ViewOnlyInfluencerProfilePage";
import AllInfluencerPage from "../../features/general/AllInfluencerPage";
import AllBrandPage from "../../features/general/AllBrandPage";
import FeedbackViewPage from "../../features/general/feedback/AdminFeedbackPage";

export const generalRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/campaign/:campaignId", element: <CampaignDetailPage /> },
    { path: "/influencers", element: <AllInfluencerPage /> },
    { path: "/brands", element: <AllBrandPage /> },
    { path: "/about-us", element: <AboutUsPage /> },
    { path: "/influencer/:influencerId", element: <ViewOnlyInfluencerProfilePage /> },
    { path: "/brand/:brandId", element: <ViewOnlyBrandProfilePage /> },
    {
        path: "/feedback",
        element: (
            <ProtectedRoute allowedRoles={[USER_ROLES.INFLUENCER, USER_ROLES.BRAND]} children={<FeedbackForm />} />
        ),
    },
    // {
    //     path: "/admin/feedbacks",
    //     element: <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} children={<FeedbackViewPage />} />,
    // },
    {
        path: "/admin/feedbacks",
        element: <FeedbackViewPage />,
    },
];
