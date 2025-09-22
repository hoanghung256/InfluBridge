import App from "../../App";
import AuthLayout from "../layouts/AuthLayout";
import GeneralLayout from "../layouts/GeneralLayout";
import { authRoutes } from "./authRoutes";
import { brandRoutes } from "./brandRoutes";
import { generalRoutes } from "./generalRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    { element: <GeneralLayout />, children: [...brandRoutes, ...generalRoutes] },
];
