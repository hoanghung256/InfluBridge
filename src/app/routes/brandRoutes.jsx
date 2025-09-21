import CampaignPage from "../../features/manageCampaign/pages/CampaignPage";
import CreateCampaign from "../../features/manageCampaign/pages/CreateCampaign";

export const brandRoutes = [
    { path: "/campaigns", element: <CampaignPage /> },
    { path: "/campaign/create", element: <CreateCampaign /> },
];
