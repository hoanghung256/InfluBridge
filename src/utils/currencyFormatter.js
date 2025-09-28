export const CURRENCY_TYPE = {
    VND: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }),
};

export const formatVNDCurrency = (value) => {
    if (value == null) return "";
    return CURRENCY_TYPE.VND.format(value);
};
