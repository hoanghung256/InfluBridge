import { useEffect, useState, useMemo } from "react";
import { useClerkUserData } from "../../../../hooks/useClerkUserData";
import { convexMutation, convexQueryOneTime } from "../../../../service/convexClient";
import { api } from "../../../../../convex/_generated/api";
import {
    Button,
    TextField,
    MenuItem,
    Stack,
    Typography,
    Paper,
    Box,
    Autocomplete,
    Chip,
    Divider,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../../store/authSlice";
import useCategories from "../../../../hooks/useCategories";

function LoginCallback() {
    const { user } = useClerkUserData();
    const [fetchedUser, setFetchedUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isCheckingUserExist, setIsCheckingUserExist] = useState(true);
    const categories = useCategories();

    const [form, setForm] = useState({
        clerkUserId: "",
        fullname: "",
        email: "",
        role: "",
        phone: "",
        categories: [],
        // Brand fields
        brandName: "",
        budgetMin: "",
        budgetMax: "",
        description: "",
        // Influencer fields
        bio: "",
        priceMin: "",
        priceMax: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                clerkUserId: user.id,
                fullname: user.fullName || "",
                email: user.emailAddresses[0]?.emailAddress || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!user && !fetchedUser && !isCheckingUserExist) {
            navigate("/login");
        }
        if (user && !fetchedUser) {
            (async () => {
                setIsCheckingUserExist(true);
                await checkIfUserExists(user.id);
                setIsCheckingUserExist(false);
            })();
        }
        if (fetchedUser) {
            if (fetchedUser.role === "brand") navigate("/campaigns");
            if (fetchedUser.role === "influencer") navigate("/");
        }
    }, [user, fetchedUser, navigate]);

    const checkIfUserExists = async (clerkId) => {
        try {
            const existingUser = await convexQueryOneTime(api.functions.users.getUserByClerkId, {
                clerkUserId: clerkId,
            });
            if (existingUser) {
                dispatch(setUserData(existingUser));
                setFetchedUser(existingUser);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleCategoriesChange = (_, value) => {
        setForm((f) => ({ ...f, categories: value }));
    };

    const validate = () => {
        if (!form.fullname || !form.email || !form.role) return "Vui lòng nhập đầy đủ các trường bắt buộc.";
        if (form.role === "brand") {
            if (!form.brandName) return "Tên thương hiệu và ngành nghề là bắt buộc.";
            if (form.budgetMin && form.budgetMax && Number(form.budgetMin) > Number(form.budgetMax))
                return "Ngân sách tối thiểu phải nhỏ hơn hoặc bằng ngân sách tối đa.";
        }
        if (form.role === "influencer") {
            if (!form.bio) return "Thông tin tiểu sử là bắt buộc.";
            if (form.priceMin && form.priceMax && Number(form.priceMin) > Number(form.priceMax))
                return "Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        if (!user) return;
        setSubmitting(true);
        try {
            // Map payload; keep backward compatibility with name if backend expects it
            let payload = {
                clerkUserId: user.id,
                fullname: form.fullname,
                email: form.email,
                role: form.role,
                phone: form.phone || "",
                categories: form.categories.map((c) => c._id),
            };

            if (form.role === "brand") {
                payload.brandName = form.brandName;
                payload.budgetMin = form.budgetMin ? Number(form.budgetMin) : 0;
                payload.budgetMax = form.budgetMax ? Number(form.budgetMax) : 0;
                payload.description = form.description || "";
                await convexMutation(api.functions.users.createBrand, payload);
            } else if (form.role === "influencer") {
                payload.bio = form.bio || "";
                payload.priceMin = form.priceMin ? Number(form.priceMin) : 0;
                payload.priceMax = form.priceMax ? Number(form.priceMax) : 0;
                await convexMutation(api.functions.users.createInfluencer, payload);
            }
            await checkIfUserExists(user.id);
        } catch (e) {
            console.error(e);
            setError("Tạo người dùng thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const role = form.role;

    const brandFields = useMemo(() => {
        if (role !== "brand") return null;
        return (
            <>
                <Divider flexItem />
                <Typography variant="subtitle1" fontWeight={600}>
                    Thông tin thương hiệu
                </Typography>
                <TextField
                    label="Tên thương hiệu"
                    name="brandName"
                    value={form.brandName}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Ngân sách tối thiểu"
                        name="budgetMin"
                        value={form.budgetMin}
                        onChange={handleChange}
                        type="number"
                        InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }}
                        fullWidth
                    />
                    <TextField
                        label="Ngân sách tối đa"
                        name="budgetMax"
                        value={form.budgetMax}
                        onChange={handleChange}
                        type="number"
                        InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }}
                        fullWidth
                    />
                </Stack>
                <TextField
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                />
            </>
        );
    }, [role, form.brandName, form.budgetMin, form.budgetMax, form.description]);

    const influencerFields = useMemo(() => {
        if (role !== "influencer") return null;
        return (
            <>
                <Divider flexItem />
                <Typography variant="subtitle1" fontWeight={600}>
                    Thông tin người ảnh hưởng
                </Typography>
                <TextField
                    label="Tiểu sử"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={3}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Giá tối thiểu"
                        name="priceMin"
                        value={form.priceMin}
                        onChange={handleChange}
                        type="number"
                        InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }}
                        fullWidth
                    />
                    <TextField
                        label="Giá tối đa"
                        name="priceMax"
                        value={form.priceMax}
                        onChange={handleChange}
                        type="number"
                        InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }}
                        fullWidth
                    />
                </Stack>
            </>
        );
    }, [role, form.bio, form.priceMin, form.priceMax]);

    return isCheckingUserExist ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h6">Đang kiểm tra thông tin người dùng...</Typography>
        </Box>
    ) : !isCheckingUserExist && !fetchedUser ? (
        <Box display="flex" justifyContent="center" mt={4} px={2}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 640, width: "100%" }}>
                <Typography variant="h5" mb={2} fontWeight={600}>
                    Hoàn thiện tài khoản của bạn
                </Typography>
                <Typography variant="body2" mb={3}>
                    Vui lòng cung cấp thông tin cần thiết.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {/* Shared Fields */}
                        <TextField
                            label="Họ và tên"
                            name="fullname"
                            value={form.fullname}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled
                            fullWidth
                        />
                        <TextField
                            select
                            label="Vai trò"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            fullWidth
                        >
                            <MenuItem value="">Chọn vai trò</MenuItem>
                            <MenuItem value="brand">Thương hiệu</MenuItem>
                            <MenuItem value="influencer">Người ảnh hưởng</MenuItem>
                        </TextField>
                        <TextField
                            label="Số điện thoại"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Autocomplete
                            multiple
                            options={categories}
                            value={form.categories}
                            onChange={handleCategoriesChange}
                            getOptionLabel={(option) => option.name}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={option.name}
                                        {...getTagProps({ index })}
                                        key={option._id}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Danh mục" placeholder="Chọn danh mục" />
                            )}
                        />

                        {/* Conditional Blocks */}
                        {brandFields}
                        {influencerFields}

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                            {submitting ? "Đang lưu..." : "Hoàn tất"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    ) : null;
}

export default LoginCallback;
