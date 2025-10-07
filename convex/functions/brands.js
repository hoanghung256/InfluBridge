import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        brandId: v.id("brands"),
        brandName: v.optional(v.string()),
        phone: v.optional(v.string()),
        fullname: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        description: v.optional(v.string()),
        budgetMin: v.number(),
        budgetMax: v.number(),
        categories: v.array(v.id("categories")),
        socialChannel: v.optional(v.array(v.object({ platform: v.string(), url: v.string() }))),
    },
    handler: async (ctx, args) => {
        // Update basic user fields
        await ctx.db.patch("users", args.userId, {
            fullname: args.fullname || undefined,
            phone: args.phone || undefined,
        });

        const update = {
            categories: args.categories,
            budgetMin: args.budgetMin,
            budgetMax: args.budgetMax,
        };

        if (args.brandName !== undefined) update.brandName = args.brandName;
        if (args.avatarUrl !== undefined) update.avatarUrl = args.avatarUrl;
        if (args.description !== undefined) update.description = args.description;
        if (args.socialChannel !== undefined) update.socialChannel = args.socialChannel;

        await ctx.db.patch("brands", args.brandId, update);

        const brand = await ctx.db.get("brands", args.brandId);
        if (!brand) throw new Error("Brand not found after update");
        const user = await ctx.db.get("users", brand.userId);
        if (!user) throw new Error("User not found for brand");

        return {
            ...user,
            detail: { ...brand },
        };
    },
});

export const getById = query({
    args: {
        brandId: v.id("brands"),
    },
    handler: async (ctx, args) => {
        const brand = await ctx.db.get("brands", args.brandId);
        if (!brand) return null;
        const user = await ctx.db.get("users", brand.userId);
        if (!user) return null;
        return {
            ...user,
            detail: brand,
        };
    },
});
