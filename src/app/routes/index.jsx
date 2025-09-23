import App from "../../App";
import ProtectedRoute from "../../components/ProtectedRoute";
import { USER_ROLES } from "../../constants/common";
import AuthLayout from "../layouts/AuthLayout";
import BrandLayout from "../layouts/BrandLayout";
import GeneralLayout from "../layouts/GeneralLayout";
import { authRoutes } from "./authRoutes";
import { brandRoutes } from "./brandRoutes";
import { generalRoutes } from "./generalRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    { element: <GeneralLayout />, children: generalRoutes },
    {
        element: (
            <ProtectedRoute allowedRoles={USER_ROLES.BRAND}>
                <BrandLayout />
            </ProtectedRoute>
        ),
        children: brandRoutes,
    },
];
