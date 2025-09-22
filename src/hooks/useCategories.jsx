import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { convexQueryOneTime } from "../service/convexClient";

function useCategories() {
    const [categories, setCategories] = useState(
        localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [],
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, []);

    const fetchCategories = async () => {
        const data = await convexQueryOneTime(api.functions.categories.getAll);
        localStorage.setItem("categories", JSON.stringify(data));
        setCategories(data);
        setLoading(false);
    };

    return { categories, loading };
}

export default useCategories;
