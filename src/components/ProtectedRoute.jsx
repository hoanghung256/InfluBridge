import { Navigate } from "react-router-dom";
import useConvexUserData from "../hooks/useConvexUserData";
import { CircularProgress } from "@mui/material";

function ProtectedRoute({ allowedRoles, children }) {
    const user = useConvexUserData();

    if (user === undefined) {
        return <CircularProgress />;
    }

    if (user?.role !== allowedRoles) {
        return <Navigate to="/login" />;
    } else {
        return children;
    }
}

export default ProtectedRoute;
