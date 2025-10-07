import CampaignAppliesPage from "../../features/campaignApplication/CampaignAppliesPage";
import CampaignPage from "../../features/manageCampaign/pages/CampaignPage";
import CreateCampaign from "../../features/manageCampaign/pages/CreateCampaign";
import BrandMyProfilePage from "../../features/profile/BrandMyProfilePage";

export const brandRoutes = [
    { path: "/campaigns", element: <CampaignPage /> },
    { path: "/campaigns/create", element: <CreateCampaign /> },
    { path: "/campaigns/application/:campaignId", element: <CampaignAppliesPage /> },
    { path: "/brand/my-profile", element: <BrandMyProfilePage /> },
];
