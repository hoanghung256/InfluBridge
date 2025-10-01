export const STORAGE_FOLDER = {
    AVATARS: "avatars",
    CAMPAIGN_BANNER: "campaign-banners",
};

export const SOCIAL_PLATFORMS = {
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    TIKTOK: "tiktok",
    YOUTUBE: "youtube",
    // TWITTER: "twitter",
    // LINKEDIN: "linkedin",
    // SNAPCHAT: "snapchat",
    // PINTEREST: "pinterest",
};

export const SOCIAL_PLATFORM_OPTIONS = [
    { label: "Facebook", value: SOCIAL_PLATFORMS.FACEBOOK },
    { label: "Instagram", value: SOCIAL_PLATFORMS.INSTAGRAM },
    { label: "TikTok", value: SOCIAL_PLATFORMS.TIKTOK },
    { label: "YouTube", value: SOCIAL_PLATFORMS.YOUTUBE },
];

export const USER_ROLES = {
    BRAND: "brand",
    INFLUENCER: "influencer",
    ADMIN: "admin",
};

export const CAMPAIGN_STATUSES = {
    APPLIED: "applied",
    INVITED: "invited",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
};

export const CAMPAIGN_STATUS_OPTIONS = {
    APPLIED: { label: "Ứng tuyển", value: CAMPAIGN_STATUSES.APPLIED, color: "info" },
    INVITED: { label: "Mời", value: CAMPAIGN_STATUSES.INVITED, color: "warning" },
    ACCEPTED: { label: "Chấp nhận", value: CAMPAIGN_STATUSES.ACCEPTED, color: "success" },
    REJECTED: { label: "Từ chối", value: CAMPAIGN_STATUSES.REJECTED, color: "error" },
};
