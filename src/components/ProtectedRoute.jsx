import { Navigate, Outlet } from "react-router-dom";
import useConvexUserData from "../hooks/useConvexUserData";
import { CircularProgress } from "@mui/material";

function ProtectedRoute({ allowedRoles }) {
    const user = useConvexUserData();

    if (user === undefined) {
        return <CircularProgress />;
    }

    if (user?.role !== allowedRoles) {
        return <Navigate to="/login" />;
    } else {
        return <Outlet />;
    }
}

export default ProtectedRoute;
