import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const applyIntoCampaign = mutation({
    args: {
        campaignId: v.id("campaigns"),
        influencerId: v.id("influencers"),
    },
    handler: async (ctx, { campaignId, influencerId }) => {
        // 1. Campaign existence
        const campaign = await ctx.db.get(campaignId);
        if (!campaign) {
            throw new Error("Campaign not found.");
        }
        if (campaign.status !== "open") {
            throw new Error("Campaign is not open for applications.");
        }

        // 2. Influencer existence
        const influencer = await ctx.db.get(influencerId);
        if (!influencer) {
            throw new Error("Influencer not found.");
        }
        // 3. Check if already applied
        const existingApps = await ctx.db
            .query("campaignApplications")
            .filter((q) => q.eq(q.field("campaignId"), campaignId))
            .filter((q) => q.eq(q.field("influencerId"), influencerId))
            .collect();
        if (existingApps.length > 0) {
            throw new Error("You have already applied to this campaign.");
        }
        // 4. Create application
        const appId = await ctx.db.insert("campaignApplications", {
            campaignId,
            influencerId,
            status: "applied",
        });
        return { applicationId: appId };
    },
});

export const getApplicationsGeneral = query({
    args: {
        campaignId: v.optional(v.id("campaigns")),
        influencerId: v.optional(v.id("influencers")),
        status: v.optional(
            v.union(v.literal("applied"), v.literal("invited"), v.literal("accepted"), v.literal("rejected")),
        ),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("campaignApplications");
        if (args.campaignId) {
            q = q.filter((ca) => ca.eq(ca.field("campaignId"), args.campaignId));
        }
        if (args.influencerId) {
            q = q.filter((ca) => ca.eq(ca.field("influencerId"), args.influencerId));
        }
        if (args.status) {
            q = q.filter((ca) => ca.eq(ca.field("status"), args.status));
        }

        const applications = await q.collect();

        const enriched = await Promise.all(
            applications.map(async (app) => {
                const influencer = await ctx.db.get(app.influencerId);
                let detail = await ctx.db.get(influencer.userId);
                return {
                    ...app,
                    influencer,
                    influencerDetail: detail,
                };
            }),
        );

        return enriched;
    },
});

export const updateApplicationStatus = mutation({
    args: {
        campaignId: v.id("campaigns"),
        influencerId: v.id("influencers"),
        status: v.union(v.literal("applied"), v.literal("invited"), v.literal("accepted"), v.literal("rejected")),
    },
    handler: async (ctx, { campaignId, influencerId, status }) => {
        // Find application by campaignId + influencerId
        const app = await ctx.db
            .query("campaignApplications")
            .filter((q) => q.eq(q.field("campaignId"), campaignId))
            .filter((q) => q.eq(q.field("influencerId"), influencerId))
            .first();

        if (!app) {
            throw new Error("Application not found for this campaign and influencer.");
        }

        // No-op if same status
        if (app.status === status) {
            return { ...app, status };
        }

        const updatedAt = Date.now();

        await ctx.db.patch(app._id, { status, updatedAt });

        return { ...app, status, updatedAt };
    },
});
