import { useMemo, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Box,
    Typography,
    Stack,
} from "@mui/material";

function CampaignApplyConfirmModal({ open, campaign, onClose = () => {} }) {
    const TERMS = useMemo(
        () => [
            "Vui lòng gửi bài đăng cuối cùng của bạn trong thời gian quy định, nếu không bạn sẽ được yêu cầu thanh toán cho sản phẩm và phí vận chuyển vv",
            "Không xóa hoặc đặt tin bài riêng của bạn, nếu không bạn sẽ phải thanh toán cho sản phẩm và phí vận chuyển v.v...",
            "Nếu cần, bài đăng của bạn có thể được sử dụng để quảng bá.",
            "Không bán lại. Không chuyển nhượng.",
            "Tôi đồng ý với các điều khoản và điều kiện của chiến dịch đưa ra.",
            "Tôi đã xác định chiến dịch Đối tác và đồng ý cung cấp thông tin cho đối tác.",
        ],
        [],
    );

    const [checked, setChecked] = useState(() => Array(TERMS.length).fill(false));
    const allChecked = checked.every(Boolean);

    const toggle = (idx) => {
        setChecked((arr) => arr.map((v, i) => (i === idx ? !v : v)));
    };

    const handleConfirm = () => {
        if (!allChecked) return;
        // Confirm logic
        setChecked(Array(TERMS.length).fill(false));
        onClose();
    };

    const handleClose = () => {
        setChecked(Array(TERMS.length).fill(false));
        onClose();
    };

    const agreedCount = checked.filter(Boolean).length;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Xác nhận ứng tuyển</DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <DialogContentText component="div">
                        <Typography variant="body2">Vui lòng đọc cẩn thận trước khi bạn nộp đơn.</Typography>
                        {campaign?.title && (
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                Chiến dịch: <strong>{campaign.title}</strong>
                            </Typography>
                        )}
                    </DialogContentText>

                    <FormGroup className="p-2 rounded" sx={{ bgcolor: "grey.100" }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Vui lòng đồng ý với các điều khoản và điều kiện sau, bạn không thể tiến hành trừ khi bạn
                            đồng ý với tất cả các điều khoản và điều kiện:
                        </Typography>
                        {TERMS.map((term, i) => (
                            <FormControlLabel
                                key={i}
                                control={<Checkbox checked={checked[i]} onChange={() => toggle(i)} size="small" />}
                                label={
                                    <Typography sx={{ alignSelf: "center" }} variant="body2">
                                        {term}
                                    </Typography>
                                }
                                sx={{ alignItems: "flex-start", mb: 0.5 }}
                            />
                        ))}
                    </FormGroup>

                    <Box className="d-flex justify-content-end">
                        <Typography variant="caption" color={allChecked ? "success.main" : "text.secondary"}>
                            Đã đồng ý: {agreedCount}/{TERMS.length}
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="text">
                    Hủy
                </Button>
                <Button onClick={handleConfirm} variant="contained" disabled={!allChecked}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CampaignApplyConfirmModal;
