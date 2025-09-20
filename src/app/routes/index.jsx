import App from "../../App";
import AuthLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { authRoutes } from "./authRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    { element: <DefaultLayout />, children: [{ path: "/", element: <App /> }] },
];
