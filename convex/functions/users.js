import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = query({
    args: {
        clerkUserId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
            .unique();

        if (user) {
            if (user.role === "brand") {
                const brandDetail = await ctx.db
                    .query("brands")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .unique();
                user.detail = brandDetail;
            } else if (user.role === "influencer") {
                const influencerDetail = await ctx.db
                    .query("influencers")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .unique();
                user.detail = influencerDetail;
            }
        }

        return user ?? null;
    },
});

export const createBrand = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        fullname: v.string(),
        phone: v.string(),
        role: v.literal("brand"),
        brandName: v.string(),
        budgetMin: v.number(),
        budgetMax: v.number(),
        categories: v.array(v.id("categories")),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert("users", {
            clerkUserId: args.clerkUserId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
            isActive: true,
            isVerified: true,
        });
        let brand = {
            id: userId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
        };

        await ctx.db.insert("brands", {
            userId: userId,
            brandName: args.brandName,
            industry: args.industry,
            budgetMin: args.budgetMin,
            budgetMax: args.budgetMax,
            categories: args.categories,
            description: args.description,
        });

        return {
            userId: userId,
            clerkUserId: args.clerkUserId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
            isActive: true,
            isVerified: true,
            userDetail: { ...brand },
        };
    },
});

export const createInfluencer = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        fullname: v.string(),
        phone: v.string(),
        role: v.literal("influencer"),
        categories: v.array(v.id("categories")),
        bio: v.optional(v.string()),
        priceMin: v.number(),
        priceMax: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert("users", {
            clerkUserId: args.clerkUserId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
            isActive: true,
            isVerified: true,
        });
        let influencer = {
            id: userId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
        };

        await ctx.db.insert("influencers", {
            userId: userId,
            bio: args.bio,
            categories: args.categories,
            priceMin: args.priceMin,
            priceMax: args.priceMax,
        });

        return {
            userId: userId,
            clerkUserId: args.clerkUserId,
            fullname: args.fullname,
            email: args.email,
            role: args.role,
            phone: args.phone,
            isActive: true,
            isVerified: true,
            userDetail: { ...influencer },
        };
    },
});
