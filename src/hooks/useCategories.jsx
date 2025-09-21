import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { convexQueryOneTime } from "../service/convexClient";

function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await convexQueryOneTime(api.functions.categories.getAll);
            setCategories(data);
            setLoading(false);
        };

        fetchCategories();
    }, []);

    return { categories, loading };
}

export default useCategories;
