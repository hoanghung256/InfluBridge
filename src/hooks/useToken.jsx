import { useSelector } from "react-redux";

function useToken() {
    const token = useSelector((s) => s?.auth?.token ?? null);
    return token;
}

export default useToken;
