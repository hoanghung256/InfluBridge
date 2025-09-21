import App from "../../App";
import AuthLayout from "../layouts/AuthLayout";
import GeneralLayout from "../layouts/GeneralLayout";
import { authRoutes } from "./authRoutes";
import { brandRoutes } from "./brandRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    { element: <GeneralLayout />, children: [{ path: "/", element: <App /> }] },
    { element: <GeneralLayout />, children: brandRoutes },
];
