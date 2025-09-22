import LoginCallback from "../../features/auth/pages/login/LoginCallback";
import LoginPage from "../../features/auth/pages/login/LoginPage";
import SignOutCallback from "../../features/auth/pages/SignOutCallback";
import SignUpPage from "../../features/auth/pages/SignUpPage";

export const authRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/sign-up", element: <SignUpPage /> },
    { path: "/login-callback", element: <LoginCallback /> },
    { path: "/signout-callback", element: <SignOutCallback /> },
];
