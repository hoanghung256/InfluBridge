import LoginCallback from "../../features/auth/pages/login/LoginCallback";
import LoginPage from "../../features/auth/pages/login/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";

export const authRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/login-callback", element: <LoginCallback /> },
];
