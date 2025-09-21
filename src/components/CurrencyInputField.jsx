import { TextField, InputAdornment } from "@mui/material";

function CurrencyInputField({ label, name, form, setForm }) {
    const handleChange = (e) => {
        const rawValue = e.target.value.toString().replace(/[.,\s]/g, "");
        const numericValue = rawValue === "" ? "" : Number(rawValue);

        setForm({ ...form, [name]: numericValue });
    };

    const formatNumber = (value) => {
        if (value === "" || value == null) return "";
        return new Intl.NumberFormat("vi-VN").format(value);
    };

    return (
        <TextField
            label={label}
            name={name}
            value={formatNumber(form[name])}
            onChange={handleChange}
            slotProps={{
                startAdornment: <InputAdornment position="start">đ</InputAdornment>,
            }}
            fullWidth
        />
    );
}

export default CurrencyInputField;
