import App from "../../App";
import AuthLayout from "../layouts/AuthLayout";
import GeneralLayout from "../layouts/GeneralLayout";
import { authRoutes } from "./authRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    { element: <GeneralLayout />, children: [{ path: "/", element: <App /> }] },
];
