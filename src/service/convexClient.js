// src/services/convexClient.js
// Lightweight Convex client helpers for queries and mutations from the frontend
import { ConvexHttpClient } from "convex/browser";
import { useQuery } from "convex/react";
import { CONVEX_HTTP_URL } from "../constants/env";

let client;

export function getConvexClient() {
    if (!client) {
        if (!CONVEX_HTTP_URL) throw new Error("VITE_CONVEX_URL is not set");
        client = new ConvexHttpClient(CONVEX_HTTP_URL);
    }
    return client;
}

export async function convexQueryOneTime(func, args) {
    const c = getConvexClient();
    return await c.query(func, args);
}

export async function convexMutation(func, args) {
    const c = getConvexClient();
    return await c.mutation(func, args);
}

export function convexQueryRealtime(func, args) {
    return useQuery(func, args);
}
