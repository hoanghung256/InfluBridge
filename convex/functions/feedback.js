import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        userId: v.id("users"),
        title: v.optional(v.string()),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        // Verify user exists
        const user = await ctx.db.get("users", args.userId);
        if (!user) throw new Error("User not found");

        const feedbackId = await ctx.db.insert("systemFeedback", {
            userId: args.userId,
            title: args.title,
            message: args.message,
        });

        return { _id: feedbackId };
    },
});

export const listMine = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // Since there is no index, do a table scan and filter (ok for small volumes).
        const all = await ctx.db.query("systemFeedback").collect();
        return all.filter((f) => f.userId === args.userId);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("systemFeedback").collect();
        // Optionally hydrate with user info
        const withUsers = await Promise.all(
            all.map(async (fb) => {
                const user = await ctx.db.get("users", fb.userId);
                return {
                    ...fb,
                    user: user ? { _id: user._id, fullname: user.fullname, email: user.email, role: user.role } : null,
                };
            }),
        );
        // Recent first
        return withUsers.sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
    },
});
