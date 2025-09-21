import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * createCampaign
 * Creates a new campaign for a brand.
 * Performs validation on:
 *  - Brand existence
 *  - Category ids existence
 *  - Period chronological order (apply -> selective -> active -> review)
 *  - Budget > 0, applyLimit >= 0
 */
export const createCampaign = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        // 1. Brand existence
        const brand = await ctx.db.get(args.brandId);
        if (!brand) {
            throw new Error("Brand not found.");
        }

        // 2. Categories existence
        if (!args.categories.length) {
            throw new Error("At least one category is required.");
        }
        // Fetch all categories in parallel and ensure none missing
        const categoryDocs = await Promise.all(args.categories.map((id) => ctx.db.get(id)));
        if (categoryDocs.some((c) => !c)) {
            throw new Error("One or more categories do not exist.");
        }

        // 3. Period validation
        validatePeriods(args.periods);

        // 4. Budget validation
        if (args.budget <= 0) {
            throw new Error("Budget must be greater than 0.");
        }

        if (args.applyLimit !== undefined && args.applyLimit < 0) {
            throw new Error("applyLimit cannot be negative.");
        }

        // 5. Basic field sanity
        if (!args.title.trim()) throw new Error("Title is required.");
        if (!args.description.trim()) throw new Error("Description is required.");
        if (!args.reward.trim()) throw new Error("Reward is required.");
        if (!args.policyAndCondition.trim()) throw new Error("Policy & Condition is required.");
        if (!args.guide.trim()) throw new Error("Guide is required.");
        if (!args.contentRequired.trim()) throw new Error("Content requirement is required.");
        if (!args.location.trim()) throw new Error("Location is required.");

        // 6. Insert campaign
        const campaignId = await ctx.db.insert("campaigns", {
            brandId: args.brandId,
            title: args.title.trim(),
            categories: args.categories,
            bannerUrl: args.bannerUrl,
            periods: args.periods,
            applyLimit: args.applyLimit,
            description: args.description.trim(),
            socialPlatforms: args.socialPlatforms,
            budget: args.budget,
            reward: args.reward.trim(),
            policyAndCondition: args.policyAndCondition.trim(),
            guide: args.guide.trim(),
            contentRequired: args.contentRequired.trim(),
            location: args.location.trim(),
            status: "open",
        });

        return { campaignId };
    },
});

/**
 * Ensure each sub-period has start < end and overall chronological flow:
 * apply.end <= selective.start <= selective.end <= active.start ...
 * Allows slight overlaps only if logically consistent.
 */
function validatePeriods(periods) {
    const keys = ["apply", "selective", "active", "review"];
    keys.forEach((k) => {
        const p = periods[k];
        if (p.start >= p.end) {
            throw new Error(`Invalid period '${k}': start must be < end.`);
        }
    });

    // Sequential ordering (end of previous <= start of next)
    const seqPairs = [
        ["apply", "selective"],
        ["selective", "active"],
        ["active", "review"],
    ];
    for (const [prev, next] of seqPairs) {
        if (periods[prev].end > periods[next].start) {
            throw new Error(`Period '${prev}' must end before '${next}' starts.`);
        }
    }
}

/**
 * getCampaign
 * Fetch campaigns for a given brand with optional status filter + simple pagination.
 * NOTE: This uses in-memory slicing after collection. For very large datasets,
 * implement a cursor-based approach instead.
 */
export const getCampaignByBrandId = query({
    args: {
        brandId: v.id("brands"),
        status: v.optional(v.string()),
        page: v.optional(v.number()), // 1-based page index
        pageSize: v.optional(v.number()), // items per page
    },
    handler: async (ctx, { brandId, status, page, pageSize }) => {
        const safePageSize =
            pageSize && pageSize > 0
                ? Math.min(pageSize, 100) // hard cap
                : 10;
        const safePage = page && page > 0 ? page : 1;

        let q = ctx.db.query("campaigns");
        try {
            q = q.withIndex("by_brandId", (q) => q.eq("brandId", brandId));
        } catch {
            // index missing fallback
        }

        const all = await q.collect();
        const filtered = all
            .filter((c) => c.brandId === brandId && (status ? c.status === status : true))
            .sort((a, b) => b._creationTime - a._creationTime);

        const total = filtered.length;
        const start = (safePage - 1) * safePageSize;
        const end = start + safePageSize;
        const slice = filtered.slice(start, end);

        return {
            data: slice,
            pagination: {
                page: safePage,
                pageSize: safePageSize,
                total,
                totalPages: Math.ceil(total / safePageSize) || 1,
                hasNext: end < total,
                hasPrev: start > 0,
            },
        };
    },
});
