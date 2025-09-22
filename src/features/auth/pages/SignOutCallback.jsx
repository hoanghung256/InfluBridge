import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../../../store/authSlice";
import { useEffect } from "react";

function SignOutCallback() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setUserData(null));
        navigate("/");
    }, [dispatch, navigate]);

    return <div>Signing out...</div>;
}

export default SignOutCallback;
