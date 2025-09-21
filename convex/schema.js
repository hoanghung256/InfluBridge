import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(), // Clerk user ID
        email: v.string(),
        fullname: v.string(),
        role: v.union(v.literal("brand"), v.literal("influencer"), v.literal("admin")),
        phone: v.string(),
        isActive: v.boolean(),
        isVerified: v.boolean(),
    }).index("by_clerkUserId", ["clerkUserId"]),

    brands: defineTable({
        userId: v.id("users"),
        brandName: v.string(),
        budgetMin: v.number(),
        budgetMax: v.number(),
        categories: v.array(v.id("categories")),
        description: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    influencers: defineTable({
        userId: v.id("users"),
        bio: v.optional(v.string()),
        categories: v.array(v.id("categories")),
        priceMin: v.number(),
        priceMax: v.number(),
    }).index("by_user", ["userId"]),

    socialAccounts: defineTable({
        influencerId: v.id("influencers"),
        platform: v.string(),
        handle: v.optional(v.string()),
        url: v.string(),
        followers: v.number(),
        isVerified: v.boolean(),
    }),

    campaigns: defineTable({
        brandId: v.id("brands"),
        title: v.string(),
        categories: v.array(v.id("categories")),
        bannerUrl: v.string(),
        periods: v.object({
            apply: v.object({ start: v.number(), end: v.number() }),
            selective: v.object({ start: v.number(), end: v.number() }),
            active: v.object({ start: v.number(), end: v.number() }),
            review: v.object({ start: v.number(), end: v.number() }),
        }),
        socialPlatforms: v.array(v.string()),
        applyLimit: v.optional(v.number()),
        description: v.string(),
        budget: v.number(),
        reward: v.string(),
        policyAndCondition: v.string(),
        guide: v.string(),
        contentRequired: v.string(),
        location: v.string(),
        status: v.union(v.literal("open"), v.literal("inprogress"), v.literal("completed")),
    }),

    campaignApplications: defineTable({
        campaignId: v.id("campaigns"),
        influencerId: v.id("influencers"),
        status: v.union(v.literal("applied"), v.literal("invited"), v.literal("accepted"), v.literal("rejected")),
        proposal: v.optional(v.string()),
    }),

    categories: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        parentId: v.optional(v.id("categories")),
    }),

    // contracts: defineTable({
    //     campaignId: v.id("campaigns"),
    //     influencerId: v.id("influencers"),
    //     terms: v.string(),
    //     signedAt: v.optional(v.number()),
    //     status: v.union(v.literal("pending"), v.literal("signed"), v.literal("completed")),
    // }),

    // escrows: defineTable({
    //     contractId: v.id("contracts"),
    //     amount: v.number(),
    //     status: v.union(v.literal("funded"), v.literal("released"), v.literal("refunded")),
    //     createdAt: v.number(),
    // }),

    // ratings: defineTable({
    //     reviewerId: v.id("users"),
    //     revieweeId: v.id("users"),
    //     rating: v.number(),
    //     feedback: v.optional(v.string()),
    //     createdAt: v.number(),
    // }),
});
