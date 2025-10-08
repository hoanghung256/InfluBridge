import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";

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

        // 5. Notify brand about new application
        try {
            const brand = await ctx.db.get(campaign.brandId);
            const brandUser = brand ? await ctx.db.get(brand.userId) : null;
            const influencerUser = await ctx.db.get(influencer.userId);

            if (brandUser?._id) {
                await ctx.db.insert("notifications", {
                    userId: brandUser._id,
                    title: "Ứng tuyển mới",
                    message: `Influencer ${influencerUser?.fullname || ""} đã ứng tuyển vào chiến dịch "${campaign.title || ""}"`,
                    type: "application.applied",
                    read: false,
                    meta: { campaignId, brandId: brand?._id, influencerId, status: "applied" },
                });
            }
        } catch (e) {
            console.error("Failed to create brand notification for new application:", e);
        }
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

        // If accepted, send email + create in-app notification to influencer
        if (status === "accepted") {
            try {
                // Load influencer, user (email), campaign, brand for email context
                const influencer = await ctx.db.get(influencerId);
                const influencerUser = influencer ? await ctx.db.get(influencer.userId) : null;
                const campaign = await ctx.db.get(campaignId);
                const brand = campaign ? await ctx.db.get(campaign.brandId) : null;
                const brandUser = brand ? await ctx.db.get(brand.userId) : null;

                // if (influencerUser?.email && campaign && brand) {
                //     // Fire-and-forget action to send email
                //     await ctx.scheduler.runAfter(0, internal.functions.emails.sendInfluencerAcceptedEmail, {
                //         toEmail: influencerUser.email,
                //         toName: influencerUser.fullname,
                //         brandName: brand.brandName || brandUser?.fullname || "Thương hiệu",
                //         campaignTitle: campaign.title || "Chiến dịch",
                //     });
                // }

                // In-app notification for influencer
                if (influencerUser?._id) {
                    await ctx.db.insert("notifications", {
                        userId: influencerUser._id,
                        title: "Ứng tuyển được chấp nhận",
                        message: `Thương hiệu ${brand?.brandName || brandUser?.fullname || ""} đã chấp nhận ứng tuyển vào chiến dịch "${campaign?.title || ""}".`,
                        type: "application.accepted",
                        read: false,
                        meta: { campaignId, brandId: brand?._id, influencerId, status: "accepted" },
                    });
                }
            } catch (e) {
                console.error("Failed to schedule acceptance email:", e);
            }
        }

        return { ...app, status, updatedAt };
    },
});
