import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const { token, userData } = useSelector((state) => state.auth);

    if (!token || !userData) {
        return <Navigate to="/login" />;
    } else {
        return <Outlet />;
    }
}

export default ProtectedRoute;
