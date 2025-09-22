import AboutUsPage from "../../features/general/AboutUsPage";
import LandingPage from "../../features/general/landing/LandingPage";

export const generalRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/about-us", element: <AboutUsPage /> },
];
