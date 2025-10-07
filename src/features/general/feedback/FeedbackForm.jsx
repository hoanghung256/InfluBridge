import { useMemo, useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography, CircularProgress, Grid } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import toast from "react-hot-toast";
import useConvexUserData from "../../../hooks/useConvexUserData";
import { convexMutation } from "../../../service/convexClient";
import { api } from "../../../../convex/_generated/api";

const MAX_TITLE = 120;
const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;

function FeedbackForm({ onSubmitted }) {
    const user = useConvexUserData();

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const trimmedMessage = message.trim();
    const trimmedTitle = title.trim();

    const canSubmit = useMemo(() => {
        return !!user?._id && trimmedMessage.length >= MIN_MESSAGE;
    }, [user, trimmedMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            toast.error("Bạn cần đăng nhập để gửi góp ý.");
            return;
        }
        if (trimmedMessage.length < MIN_MESSAGE) {
            toast.error(`Vui lòng nhập tối thiểu ${MIN_MESSAGE} ký tự.`);
            return;
        }
        try {
            setSubmitting(true);
            await convexMutation(api.functions.feedback.create, {
                userId: user._id,
                title: trimmedTitle || undefined,
                message: trimmedMessage,
            });
            toast.success("Cảm ơn bạn đã gửi góp ý!");
            setTitle("");
            setMessage("");
            onSubmitted?.();
        } catch (err) {
            console.error(err);
            toast.error("Gửi góp ý thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.ctrlKey && e.key === "Enter" && canSubmit && !submitting) {
            handleSubmit(e);
        }
    };

    const messageHelper = (
        <Stack direction="row" justifyContent="space-between" width="100%">
            <span>
                {!user?._id
                    ? "Vui lòng đăng nhập để gửi góp ý."
                    : trimmedMessage.length < MIN_MESSAGE
                      ? `Nhập tối thiểu ${MIN_MESSAGE} ký tự.`
                      : "Nhấn Ctrl+Enter để gửi nhanh."}
            </span>
            <span>
                {message.length}/{MAX_MESSAGE}
            </span>
        </Stack>
    );

    return (
        <Grid container justifyContent="center" sx={{ py: 5 }}>
            <Paper
                component="form"
                onSubmit={handleSubmit}
                noValidate
                variant="outlined"
                sx={{ p: 2.5, borderRadius: 2, width: "50%" }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                        Gửi góp ý hệ thống
                    </Typography>

                    <Alert severity="info" variant="outlined">
                        Góp ý của bạn sẽ được chuyển đến đội ngũ quản trị. Vui lòng mô tả chi tiết vấn đề hoặc đề xuất.
                    </Alert>

                    <TextField
                        label="Tiêu đề (không bắt buộc)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
                        inputProps={{ maxLength: MAX_TITLE }}
                        placeholder="Ví dụ: Lỗi không thể ứng tuyển chiến dịch"
                        fullWidth
                    />

                    <TextField
                        label="Nội dung góp ý"
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                        inputProps={{ maxLength: MAX_MESSAGE }}
                        placeholder="Mô tả rõ vấn đề bạn gặp phải hoặc đề xuất cải thiện..."
                        fullWidth
                        required
                        multiline
                        minRows={4}
                        onKeyDown={onKeyDown}
                        error={!!user?._id && trimmedMessage.length > 0 && trimmedMessage.length < MIN_MESSAGE}
                        helperText={messageHelper}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                            type="button"
                            variant="text"
                            disabled={submitting || (title.length === 0 && message.length === 0)}
                            onClick={() => {
                                setTitle("");
                                setMessage("");
                            }}
                        >
                            Xóa
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!canSubmit || submitting}
                            startIcon={
                                submitting ? <CircularProgress size={18} /> : <SendRoundedIcon fontSize="small" />
                            }
                        >
                            Gửi góp ý
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Grid>
    );
}

export default FeedbackForm;
