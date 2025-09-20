import ProtectedRoute from "../../components/ProtectedRoute";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";

export const authRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/forget-password", element: null },
    { path: "/reset-password", element: null },
    {
        element: <ProtectedRoute />,
        children: [{ path: "/path", element: null }],
    },
];
