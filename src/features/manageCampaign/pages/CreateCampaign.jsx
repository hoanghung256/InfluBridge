import { useState, useMemo, useEffect, use } from "react";
import { SOCIAL_PLATFORM_OPTIONS } from "../../../constants/common";
import { icons } from "../../../constants/icons";
import {
    Box,
    Button,
    LinearProgress,
    Typography,
    Paper,
    Stack,
    TextField,
    Autocomplete,
    Chip,
    Divider,
    Alert,
} from "@mui/material";
import { uploadFile } from "../../../service/firebaseStorage";
import { convexMutation } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";
import useCategories from "../../../hooks/useCategories";
import { STORAGE_FOLDER } from "../../../constants/common";
import useConvexUserData from "../../../hooks/useConvexUserData";
import TextEditor from "../../../components/TextEditor";

/**
 * Campaign creation form.
 * Required on backend:
 * brandId, title, categories, bannerUrl, periods{apply/selective/active/review}, description,
 * budget, reward, policyAndCondition, guide, contentRequired, location
 */
function CreateCampaign() {
    // Try to derive brandId from stored user (adjust selectors to your state shape)
    const authUser = useConvexUserData();
    const { categories: allCategories = [], isLoading: catLoading } = useCategories() || {};
    const [form, setForm] = useState({
        brandId: authUser?.detail?._id || "",
        title: "",
        categoryObjs: [],
        bannerPath: "",
        socialPlatforms: [],
        applyStart: "",
        applyEnd: "",
        selectiveStart: "",
        selectiveEnd: "",
        activeStart: "",
        activeEnd: "",
        reviewStart: "",
        reviewEnd: "",
        applyLimit: "",
        description: "",
        budget: "",
        reward: "",
        policyAndCondition: "",
        guide: "",
        contentRequired: "",
        location: "",
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileError, setFileError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [bannerFile, setBannerFile] = useState(null);

    const categoryOptions = useMemo(
        () =>
            (allCategories || []).map((c) => ({
                label: c.name || c.title || c.slug || "Category",
                id: c._id,
            })),
        [allCategories],
    );

    useEffect(() => {
        if (authUser?.brandId) {
            setForm((f) => ({ ...f, brandId: authUser.brandId }));
        }
        console.log("form", form);
        console.log("formdd", authUser);
    }, [authUser, form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setBannerFile(file || null);
        setFileError("");
        setUploadProgress(0);
    };

    const uploadBanner = async () => {
        if (!bannerFile) {
            setFileError("Select an image banner.");
            return;
        }
        setUploading(true);
        setFileError("");
        try {
            const path = await uploadFile(bannerFile, {
                folder: STORAGE_FOLDER.CAMPAIGN_BANNER,
                onProgress: (p) => setUploadProgress(p),
            });
            setForm((f) => ({ ...f, bannerPath: path }));
        } catch (e) {
            console.error(e);
            setFileError("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const toTs = (val) => (val ? new Date(val).getTime() : null);

    const validate = () => {
        if (!form.brandId) return "Missing brandId.";
        if (!form.title.trim()) return "Title required.";
        if (!form.bannerPath) return "Upload banner first.";
        if (!form.categoryObjs.length) return "Select at least one category.";
        if (!form.description.trim()) return "Description required.";
        if (!form.budget || Number(form.budget) <= 0) return "Budget must be > 0.";
        if (!form.reward.trim()) return "Reward required.";
        if (!form.policyAndCondition.trim()) return "Policy & condition required.";
        if (!form.guide.trim()) return "Guide required.";
        if (!form.contentRequired.trim()) return "Content requirement required.";
        if (!form.location.trim()) return "Location required.";

        const periods = [
            ["applyStart", "applyEnd"],
            ["selectiveStart", "selectiveEnd"],
            ["activeStart", "activeEnd"],
            ["reviewStart", "reviewEnd"],
        ];
        for (const [s, e] of periods) {
            if (!form[s] || !form[e]) return "All period dates required.";
            if (toTs(form[s]) >= toTs(form[e])) return `Invalid ${s}/${e} chronological order.`;
        }
        // Flow ordering
        if (!(toTs(form.applyEnd) <= toTs(form.selectiveStart))) return "Apply must end before selective starts.";
        if (!(toTs(form.selectiveEnd) <= toTs(form.activeStart))) return "Selective must end before active starts.";
        if (!(toTs(form.activeEnd) <= toTs(form.reviewStart))) return "Active must end before review starts.";

        if (form.applyLimit && Number(form.applyLimit) < 0) return "applyLimit cannot be negative.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const payload = {
            brandId: form.brandId,
            title: form.title.trim(),
            categories: form.categoryObjs.map((c) => c.id),
            socialPlatforms: form.socialPlatforms.map((p) => p.value),
            bannerUrl: form.bannerPath,
            periods: {
                apply: { start: toTs(form.applyStart), end: toTs(form.applyEnd) },
                selective: { start: toTs(form.selectiveStart), end: toTs(form.selectiveEnd) },
                active: { start: toTs(form.activeStart), end: toTs(form.activeEnd) },
                review: { start: toTs(form.reviewStart), end: toTs(form.reviewEnd) },
            },
            applyLimit: form.applyLimit ? Number(form.applyLimit) : undefined,
            description: form.description.trim(),
            budget: Number(form.budget),
            reward: form.reward.trim(),
            policyAndCondition: form.policyAndCondition.trim(),
            guide: form.guide.trim(),
            contentRequired: form.contentRequired.trim(),
            location: form.location.trim(),
        };

        setSubmitting(true);
        try {
            await convexMutation(api.functions.campaigns.createCampaign, payload);
            setSuccess("Campaign created.");
            // Reset minimal fields (keep brandId)
            setForm((f) => ({
                ...f,
                title: "",
                categoryObjs: [],
                bannerPath: "",
                applyStart: "",
                applyEnd: "",
                selectiveStart: "",
                selectiveEnd: "",
                activeStart: "",
                activeEnd: "",
                reviewStart: "",
                reviewEnd: "",
                applyLimit: "",
                description: "",
                budget: "",
                reward: "",
                policyAndCondition: "",
                guide: "",
                contentRequired: "",
                location: "",
            }));
            setBannerFile(null);
            setUploadProgress(0);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed creating campaign.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2, pb: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                    Create Campaign
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            size="small"
                        />

                        <Autocomplete
                            multiple
                            loading={catLoading}
                            options={categoryOptions}
                            value={form.categoryObjs}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            onChange={(_, val) => setForm((f) => ({ ...f, categoryObjs: val }))}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={option.label}
                                        {...getTagProps({ index })}
                                        key={option.id}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Categories"
                                    placeholder="Select categories"
                                    size="small"
                                />
                            )}
                        />

                        <Autocomplete
                            multiple
                            options={SOCIAL_PLATFORM_OPTIONS}
                            value={form.socialPlatforms}
                            isOptionEqualToValue={(o, v) => o.value === v.value}
                            onChange={(_, val) => setForm((f) => ({ ...f, socialPlatforms: val }))}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                    const IconEl = icons[option.value];
                                    return (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option.value}
                                            size="small"
                                            label={IconEl}
                                        />
                                    );
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Social Platforms"
                                    placeholder="Select platforms"
                                    size="small"
                                />
                            )}
                        />

                        <Divider textAlign="left">Banner</Divider>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                            <Button variant="outlined" component="label" size="small" disabled={uploading}>
                                {bannerFile ? "Change Image" : "Select Banner"}
                                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!bannerFile || uploading}
                                onClick={uploadBanner}
                            >
                                {uploading ? "Uploading..." : form.bannerPath ? "Re-upload" : "Upload"}
                            </Button>
                        </Stack>
                        {bannerFile && !form.bannerPath && (
                            <Box>
                                {bannerFile && (
                                    <Box mt={1}>
                                        <img
                                            loading="lazy"
                                            src={URL.createObjectURL(bannerFile)}
                                            alt="Banner Preview"
                                            style={{
                                                maxWidth: 320,
                                                maxHeight: 180,
                                                borderRadius: 8,
                                                border: "1px solid #eee",
                                            }}
                                        />
                                    </Box>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                    Image selected - click Upload to store.
                                </Typography>
                            </Box>
                        )}
                        {uploading && (
                            <Box>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                                <Typography variant="caption">{uploadProgress.toFixed(0)}%</Typography>
                            </Box>
                        )}
                        {form.bannerPath && (
                            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                Stored path: {form.bannerPath}
                            </Typography>
                        )}
                        {fileError && <Alert severity="error">{fileError}</Alert>}

                        <Divider textAlign="left">Periods</Divider>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                label="Apply Start"
                                type="date"
                                name="applyStart"
                                value={form.applyStart}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Apply End"
                                type="date"
                                name="applyEnd"
                                value={form.applyEnd}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                label="Selective Start"
                                type="date"
                                name="selectiveStart"
                                value={form.selectiveStart}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Selective End"
                                type="date"
                                name="selectiveEnd"
                                value={form.selectiveEnd}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                label="Active Start"
                                type="date"
                                name="activeStart"
                                value={form.activeStart}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Active End"
                                type="date"
                                name="activeEnd"
                                value={form.activeEnd}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                label="Review Start"
                                type="date"
                                name="reviewStart"
                                value={form.reviewStart}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Review End"
                                type="date"
                                name="reviewEnd"
                                value={form.reviewEnd}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Stack>

                        <Divider textAlign="left">Details</Divider>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Budget"
                                name="budget"
                                type="number"
                                value={form.budget}
                                onChange={handleChange}
                                required
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="Apply Limit (optional)"
                                name="applyLimit"
                                type="number"
                                value={form.applyLimit}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                            />
                        </Stack>
                        <TextField
                            label="Reward"
                            name="reward"
                            value={form.reward}
                            onChange={handleChange}
                            required
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                            size="small"
                            fullWidth
                        />
                        {/* <TextEditor value={form.reward} onChange={(value) => setForm((f) => ({ ...f, reward: value }))} /> */}
                        <TextField
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            multiline
                            minRows={3}
                            fullWidth
                        />
                        <TextField
                            label="Policy & Condition"
                            name="policyAndCondition"
                            value={form.policyAndCondition}
                            onChange={handleChange}
                            required
                            multiline
                            minRows={2}
                            fullWidth
                        />
                        <TextField
                            label="Guide"
                            name="guide"
                            value={form.guide}
                            onChange={handleChange}
                            required
                            multiline
                            minRows={2}
                            fullWidth
                        />
                        <TextField
                            label="Content Required"
                            name="contentRequired"
                            value={form.contentRequired}
                            onChange={handleChange}
                            required
                            multiline
                            minRows={10}
                            fullWidth
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Box display="flex" gap={2}>
                            <Button type="submit" variant="contained" disabled={submitting || uploading}>
                                {submitting ? "Creating..." : "Create Campaign"}
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                disabled={submitting}
                                onClick={() => {
                                    setError("");
                                    setSuccess("");
                                    setForm((f) => ({
                                        ...f,
                                        title: "",
                                        categoryObjs: [],
                                        bannerPath: "",
                                        applyStart: "",
                                        applyEnd: "",
                                        selectiveStart: "",
                                        selectiveEnd: "",
                                        activeStart: "",
                                        activeEnd: "",
                                        reviewStart: "",
                                        reviewEnd: "",
                                        applyLimit: "",
                                        description: "",
                                        budget: "",
                                        reward: "",
                                        policyAndCondition: "",
                                        guide: "",
                                        contentRequired: "",
                                        location: "",
                                    }));
                                    setBannerFile(null);
                                    setUploadProgress(0);
                                }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}

export default CreateCampaign;
