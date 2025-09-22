import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { convexQueryOneTime } from "../service/convexClient";

const LS_KEY = "categories_cache_v1";
const DEFAULT_TTL_MS = 1000 * 60 * 10; // 10 minutes

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function useCategories({ ttl = DEFAULT_TTL_MS, skip = false } = {}) {
    const [categories, setCategories] = useState(() => {
        if (typeof window === "undefined") return [];
        const raw = localStorage.getItem(LS_KEY);
        const parsed = raw ? safeParse(raw) : null;
        if (!parsed || !Array.isArray(parsed.data)) return [];
        const isFresh = Date.now() - parsed.timestamp < ttl;
        return isFresh ? parsed.data : [];
    });
    const [loading, setLoading] = useState(categories.length === 0);
    const [error, setError] = useState("");
    const mountedRef = useRef(true);

    const persist = (data) => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch {
            /* ignore quota errors */
        }
    };

    const fetchCategories = useCallback(
        async (force = false) => {
            if (skip) return;
            if (!force && categories.length > 0) return;
            setLoading(true);
            setError("");
            try {
                const data = await convexQueryOneTime(api.functions.categories.getAll);
                if (!mountedRef.current) return;
                setCategories(data);
                persist(data);
            } catch (e) {
                if (mountedRef.current) {
                    setError("Failed to load categories");
                }
            } finally {
                if (mountedRef.current) setLoading(false);
            }
        },
        [categories.length, skip],
    );

    // Initial load (if empty)
    useEffect(() => {
        if (skip) return;
        if (categories.length === 0) {
            fetchCategories(true);
        } else {
            setLoading(false);
        }
    }, [categories.length, fetchCategories, skip]);

    // Cleanup
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const refresh = useCallback(() => {
        fetchCategories(true);
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refresh,
        hasData: categories.length > 0,
    };
}

export default useCategories;
