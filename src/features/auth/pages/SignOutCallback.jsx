import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../../../store/authSlice";
import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

function SignOutCallback() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { signOut } = useClerk();

    useEffect(() => {
        dispatch(setUserData(null));
        signOut();
        navigate("/");
    }, [dispatch, navigate]);

    return <div>Signing out...</div>;
}

export default SignOutCallback;
