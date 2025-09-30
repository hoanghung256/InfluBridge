import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        influencerId: v.id("influencers"),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        fullname: v.optional(v.string()),
        phone: v.optional(v.string()),
        priceMin: v.number(),
        priceMax: v.number(),
        categories: v.array(v.id("categories")),
        socialChannel: v.optional(v.array(v.object({ platform: v.string(), url: v.string() }))),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch("users", args.userId, {
            fullname: args.fullname || undefined,
            phone: args.phone || undefined,
        });
        const updateDetails = {
            categories: args.categories,
            priceMin: args.priceMin,
            priceMax: args.priceMax,
        };

        if (args.bio !== undefined) updateDetails.bio = args.bio;
        if (args.avatarUrl !== undefined) updateDetails.avatarUrl = args.avatarUrl;
        if (args.socialChannel !== undefined) updateDetails.socialChannel = args.socialChannel;

        await ctx.db.patch("influencers", args.influencerId, updateDetails);
        const influencer = await ctx.db.get("influencers", args.influencerId);
        if (!influencer) {
            throw new Error("Influencer not found after update, this should not happen");
        }
        const user = await ctx.db.get("users", influencer.userId);
        if (!user) {
            throw new Error("User not found for influencer, this should not happen");
        }

        return {
            ...user,
            detail: { ...influencer },
        };
    },
});

export const getFamousInfluencers = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 4;
        const influencers = await ctx.db.query("influencers").take(limit);
        const users = await Promise.all(influencers.map((inf) => ctx.db.get(inf.userId)));

        return influencers.map((inf, idx) => ({
            ...users[idx],
            detail: inf,
        }));
    },
});
