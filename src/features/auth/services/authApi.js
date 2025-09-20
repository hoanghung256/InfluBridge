import toast from "react-hot-toast";
import { METHOD } from "../../../constants/api";
import { BE_BASE_URL } from "../../../constants/env";
import { apiConnector } from "../../../utils/apiConnector";
import { setToken, setUserData } from "../../../store/authSlice";

const endPoints = {
    LOGIN_API: BE_BASE_URL + "/auth/login",
    SIGN_UP_API: BE_BASE_URL + "/auth/signup",
};

export const login = async (email, password) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loging in...");
        try {
            const response = await apiConnector(METHOD.POST, endPoints.LOGIN_API, { email, password }, null, null);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Login successful!");

            dispatch(setToken(response.data.token));
            localStorage.setItem("token", JSON.stringify(response.data.token));

            dispatch(setUserData(response.data.userData));
            localStorage.setItem("userData", JSON.stringify(response.data.userData));
        } catch (error) {
            log("LOGIN_API ERROR: ", error);
            toast.error(error.response.data.message || "Login failed");
        }
        toast.dismiss(toastId);
    };
};
