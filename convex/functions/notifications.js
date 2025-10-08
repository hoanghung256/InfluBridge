import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        userId: v.id("users"),
        title: v.optional(v.string()),
        message: v.string(),
        type: v.optional(v.string()),
        meta: v.optional(
            v.object({
                campaignId: v.optional(v.id("campaigns")),
                brandId: v.optional(v.id("brands")),
                influencerId: v.optional(v.id("influencers")),
                status: v.optional(v.string()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("notifications", {
            userId: args.userId,
            title: args.title,
            message: args.message,
            type: args.type,
            read: false,
            meta: args.meta,
        });
        return { _id: id };
    },
});

export const listByUser = query({
    args: {
        userId: v.id("users"),
        unreadOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("notifications").withIndex("by_user", (q) => q.eq("userId", args.userId));
        const all = await q.collect();
        const items = args.unreadOnly ? all.filter((n) => !n.read) : all;
        return items.sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
    },
});

export const markRead = mutation({
    args: { notificationId: v.id("notifications"), read: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.notificationId, { read: args.read ?? true });
        return { ok: true };
    },
});
