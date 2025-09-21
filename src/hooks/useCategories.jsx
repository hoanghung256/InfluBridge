import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { convexQueryOneTime } from "../service/convexClient";

function useCategories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await convexQueryOneTime(api.functions.categories.getAll);
            setCategories(data);
            console.log("Fetched categories:", data);
        };

        fetchCategories();
    }, []);

    return categories;
}

export default useCategories;
