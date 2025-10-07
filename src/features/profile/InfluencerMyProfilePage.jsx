import { useEffect, useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    Chip,
    Divider,
    CircularProgress,
    IconButton, // + add
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem"; // + add
import { Autocomplete } from "@mui/material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useConvexUserData from "../../hooks/useConvexUserData";
import useCategories from "../../hooks/useCategories";
import { setUserData } from "../../store/authSlice";
import { api } from "../../../convex/_generated/api";
import { convexMutation } from "../../service/convexClient";
import FirebaseImg from "../../components/FirebaseImg/FirebaseImg";
import { SOCIAL_PLATFORM_OPTIONS, STORAGE_FOLDER } from "../../constants/common";
import { deleteFile, uploadFile } from "../../service/firebaseStorage"; // add this import
import AddIcon from "@mui/icons-material/Add"; // + add
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // + add
import LinkIcon from "@mui/icons-material/Link"; // + add

function InfluencerMyProfilePage() {
    const dispatch = useDispatch();
    const reduxUser = useSelector((state) => state.auth.userData);
    const user = useConvexUserData(); // expects the shape provided in the prompt
    const { categories: allCategories = [], loading: catLoading } = useCategories();

    // Build category map for labels
    const categoryMap = useMemo(() => {
        const m = {};
        (allCategories || []).forEach((c) => (m[c._id] = c.name || c.title));
        return m;
    }, [allCategories]);

    // Initial form state from user data
    const [form, setForm] = useState({
        avatarUrl: "",
        fullname: "",
        email: "",
        phone: "",
        bio: "",
        priceMin: "",
        priceMax: "",
        categories: [], // store as array of option objects {_id, name}
        socialChannel: [], // {platform, url}
    });

    const selectableCategories = useMemo(() => {
        return allCategories.filter((cat) => !form.categories.find((c) => c._id === cat._id));
    }, [allCategories, form.categories]);

    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState(false);
    const [fileError, setFileError] = useState("");
    // rename to a clearer local file + preview
    const [avatarFile, setAvatarFile] = useState(null); // selected file
    const [avatarPreview, setAvatarPreview] = useState(""); // object URL preview

    useEffect(() => {
        console.log(form);
    }, [form]);

    // Prefill when user or categories change
    useEffect(() => {
        if (!user) return;
        const d = user.detail || {};
        console.log("Prefilling form with user data:", user);
        setForm({
            avatarUrl: d.avatarUrl || "",
            fullname: user.fullname || "",
            email: user.email || "",
            phone: user.phone || "",
            bio: d.bio || "",
            priceMin: d.priceMin ?? "",
            priceMax: d.priceMax ?? "",
            categories: (d.categories || [])
                .map((id) => ({ _id: id, name: categoryMap[id] || "Danh mục" }))
                .filter(Boolean),
            socialChannel: d.socialChannel || [],
        });
    }, [user, categoryMap, reduxUser]);

    // Generate/revoke preview when a new file is selected
    useEffect(() => {
        if (!avatarFile) {
            setAvatarPreview("");
            return;
        }
        const url = URL.createObjectURL(avatarFile);
        setAvatarPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [avatarFile]);

    // Validation
    const errors = useMemo(() => {
        const e = {};
        if (!form.fullname.trim()) e.fullname = "Vui lòng nhập họ tên";
        // Optional: simple phone validation
        if (form.phone && !/^[0-9+\-\s()]{6,20}$/.test(form.phone)) e.phone = "Số điện thoại không hợp lệ";
        const min = Number(form.priceMin || 0);
        const max = Number(form.priceMax || 0);
        if (min < 0) e.priceMin = "Giá tối thiểu không hợp lệ";
        if (max < 0) e.priceMax = "Giá tối đa không hợp lệ";
        if (min && max && max < min) e.priceMax = "Giá tối đa phải ≥ giá tối thiểu";
        if (!form.categories || form.categories.length === 0) e.categories = "Chọn ít nhất 1 danh mục";
        // Social: mark invalid if any row has error
        // if ((form.socialChannel || []).some((r) => Object.keys(socialRowErrors(r)).length > 0)) {
        //     e.socialChannel = "Kiểm tra liên kết mạng xã hội";
        // }
        return e;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]); // uses socialRowErrors from closure

    const isInvalid = Object.keys(errors).length > 0;

    const onChange = (key) => (e) => {
        setTouched(true);
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const initials = useMemo(() => toInitials(form.fullname || user?.fullname || "U"), [form.fullname, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        if (isInvalid) {
            toast.error("Vui lòng kiểm tra lại thông tin.");
            return;
        }
        console.log(user);
        if (!user?._id || !user?.detail?._id) {
            toast.error("Không tìm thấy thông tin người dùng.");
            return;
        }
        if (form.avatarUrl) {
            deleteFile(form.avatarUrl); // delete old avatar if exists
        }

        try {
            setSubmitting(true);

            let path = form.avatarUrl;
            if (avatarFile) {
                // Upload new avatar
                path = await uploadFile(avatarFile, {
                    folder: STORAGE_FOLDER.AVATARS,
                });
            }
            const payload = {
                userId: user._id,
                influencerId: user.detail._id,
                bio: form.bio?.trim() || "",
                avatarUrl: path,
                fullname: form.fullname.trim(),
                phone: form.phone?.trim() || "",
                priceMin: Number(form.priceMin || 0),
                priceMax: Number(form.priceMax || 0),
                categories: form.categories.map((o) => o._id),
                // filter out empty rows
                socialChannel:
                    (form.socialChannel || [])
                        .filter((r) => r.platform && r.url)
                        .map((o) => ({ platform: o.platform.trim(), url: o.url.trim() })) || [],
            };

            // Update on backend (adjust function name if different in your convex functions)
            const updated = await convexMutation(api.functions.influencers.updateProfile, payload);

            // Update local store
            if (updated) {
                console.log("User profile updated:", updated);
                dispatch(setUserData(updated));
            } else {
                // If API returns nothing, optimistically patch local user
                dispatch(
                    setUserData({
                        ...user,
                        fullname: payload.fullname,
                        phone: payload.phone,
                        detail: {
                            ...(user.detail || {}),
                            bio: payload.bio,
                            priceMin: payload.priceMin,
                            priceMax: payload.priceMax,
                            categories: payload.categories,
                        },
                    }),
                );
            }

            toast.success("Đã lưu hồ sơ.");
            setTouched(false);
        } catch (err) {
            console.error(err);
            toast.error("Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        if (!user) return;
        const d = user.detail || {};
        setForm({
            avatarUrl: d.avatarUrl || "",
            fullname: user.fullname || "",
            email: user.email || "",
            phone: user.phone || "",
            bio: d.bio || "",
            priceMin: d.priceMin ?? "",
            priceMax: d.priceMax ?? "",
            categories: (d.categories || []).map((id) => ({ _id: id, name: categoryMap[id] || "Danh mục" })),
        });
        setTouched(false);
        setAvatarFile(null);
        setFileError("");
        setAvatarPreview("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setAvatarFile(null);
            setFileError("");
            return;
        }
        // basic validations
        if (!file.type.startsWith("image/")) {
            setFileError("Chỉ chấp nhận tệp hình ảnh.");
            return;
        }
        const MAX_MB = 5;
        if (file.size > MAX_MB * 1024 * 1024) {
            setFileError(`Kích thước tối đa ${MAX_MB}MB.`);
            return;
        }
        setAvatarFile(file);
        setFileError("");
    };

    return (
        <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="md">
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}
                    variant="outlined"
                >
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        {avatarPreview ? (
                            <Box
                                component="img"
                                src={avatarPreview}
                                alt="Avatar preview"
                                sx={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
                            />
                        ) : form?.avatarUrl ? (
                            <FirebaseImg
                                fileName={form.avatarUrl}
                                width={100}
                                height={100}
                                inputClassName="rounded-circle"
                            />
                        ) : (
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontWeight: 700,
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                }}
                            >
                                {initials}
                            </Avatar>
                        )}

                        <Button variant="outlined" component="label" size="small" disabled={submitting}>
                            Chọn ảnh
                            <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                        </Button>

                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Chỉnh sửa hồ sơ
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cập nhật thông tin cá nhân và mức giá của bạn
                            </Typography>
                            {fileError && (
                                <Typography variant="caption" color="error" display="block">
                                    {fileError}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Họ và tên"
                                value={form.fullname}
                                onChange={onChange("fullname")}
                                fullWidth
                                required
                                error={touched && !!errors.fullname}
                                helperText={touched && errors.fullname}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Email" value={form.email} fullWidth slotProps={{ readOnly: true }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số điện thoại"
                                value={form.phone}
                                onChange={onChange("phone")}
                                fullWidth
                                error={touched && !!errors.phone}
                                helperText={touched && errors.phone}
                            />
                        </Grid>

                        <Grid item>
                            <Autocomplete
                                fullWidth
                                multiple
                                options={selectableCategories}
                                loading={catLoading}
                                value={form.categories}
                                isOptionEqualToValue={(o, v) => o._id === (v._id || v)}
                                getOptionLabel={(o) => o?.name || o?.title || ""}
                                onChange={(_, val) => {
                                    setTouched(true);
                                    setForm((f) => ({ ...f, categories: val }));
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={option._id}
                                            label={option.name || option.title}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Danh mục"
                                        error={touched && !!errors.categories}
                                        helperText={touched && errors.categories}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Social channels CRUD */}
                        <Grid item xs={12}>
                            <SocialChannelBuilder
                                setForm={setForm}
                                form={form}
                                touched={touched}
                                setTouched={setTouched}
                                errors={errors}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <TextField
                                label="Giới thiệu (bio)"
                                value={form.bio}
                                onChange={onChange("bio")}
                                fullWidth
                                multiline
                                minRows={3}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giá tối thiểu (VND)"
                                type="number"
                                value={form.priceMin}
                                onChange={onChange("priceMin")}
                                fullWidth
                                inputProps={{ min: 0, step: 1000 }}
                                error={touched && !!errors.priceMin}
                                helperText={touched && errors.priceMin}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giá tối đa (VND)"
                                type="number"
                                value={form.priceMax}
                                onChange={onChange("priceMax")}
                                fullWidth
                                inputProps={{ min: 0, step: 1000 }}
                                error={touched && !!errors.priceMax}
                                helperText={touched && errors.priceMax}
                            />
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
                        <Button variant="outlined" onClick={handleReset} disabled={submitting}>
                            Hủy thay đổi
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting || isInvalid}>
                            {submitting ? <CircularProgress size={24} /> : "Lưu thay đổi"}
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

function SocialChannelBuilder({ setForm, form, touched, setTouched, errors }) {
    // Supported platforms for socialChannel CRUD
    const PLATFORMS = useMemo(
        () => ["YouTube", "Instagram", "TikTok", "Facebook", "Twitter", "Twitch", "LinkedIn", "Website"],
        [],
    );

    // Handlers for socialChannel CRUD
    const addSocialRow = () => {
        setTouched(true);
        setForm((f) => ({ ...f, socialChannel: [...(f.socialChannel || []), { platform: "", url: "" }] }));
    };

    const removeSocialRow = (idx) => {
        setTouched(true);
        setForm((f) => ({ ...f, socialChannel: (f.socialChannel || []).filter((_, i) => i !== idx) }));
    };

    const changeSocialRow = (idx, key, value) => {
        setTouched(true);
        setForm((f) => {
            const next = [...(f.socialChannel || [])];
            next[idx] = { ...next[idx], [key]: value };
            return { ...f, socialChannel: next };
        });
    };

    const socialRowErrors = (row) => {
        const errs = {};
        if (!row.platform?.trim()) errs.platform = "Chọn nền tảng";
        if (!row.url?.trim()) errs.url = "Nhập URL";
        else if (!row.url.startsWith("https://")) errs.url = "Bắt đầu bằng https://";
        return errs;
    };

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                    Mạng xã hội
                </Typography>
                <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={addSocialRow}>
                    Thêm liên kết
                </Button>
            </Stack>

            <Stack spacing={1}>
                {(form.socialChannel || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        Chưa có liên kết nào. Nhấn “Thêm liên kết” để bắt đầu.
                    </Typography>
                )}

                {(form.socialChannel || []).map((row, idx) => {
                    const rowErr = socialRowErrors(row);
                    const usedPlatforms = (form.socialChannel || []).map((r, i) => (i === idx ? null : r.platform));
                    return (
                        <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                alignItems={{ xs: "stretch", sm: "center" }}
                            >
                                <TextField
                                    select
                                    label="Nền tảng"
                                    value={row.platform || ""}
                                    onChange={(e) => changeSocialRow(idx, "platform", e.target.value)}
                                    sx={{ minWidth: { xs: "100%", sm: 180 } }}
                                    error={touched && !!rowErr.platform}
                                    helperText={touched && rowErr.platform}
                                >
                                    {SOCIAL_PLATFORM_OPTIONS.map((p) => (
                                        <MenuItem
                                            key={p.value}
                                            value={p.value}
                                            disabled={usedPlatforms.includes(p.value)}
                                        >
                                            {p.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="URL"
                                    placeholder="https://..."
                                    value={row.url || ""}
                                    onChange={(e) => changeSocialRow(idx, "url", e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <LinkIcon fontSize="small" style={{ marginRight: 6, opacity: 0.7 }} />
                                        ),
                                    }}
                                    error={touched && !!rowErr.url}
                                    helperText={touched && rowErr.url}
                                />

                                <IconButton
                                    color="error"
                                    onClick={() => removeSocialRow(idx)}
                                    aria-label="remove social link"
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Stack>
                        </Paper>
                    );
                })}

                {touched && errors.socialChannel && (form.socialChannel || []).length > 0 && (
                    <Typography variant="caption" color="error">
                        {errors.socialChannel}
                    </Typography>
                )}
            </Stack>
        </>
    );
}

function toInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return (parts[0][0] || "U").toUpperCase();
    return ((parts[0][0] || "U") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

export default InfluencerMyProfilePage;
