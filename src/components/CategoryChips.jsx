import { Stack, Chip, Typography } from "@mui/material";
import { useMemo } from "react";
import useCategories from "../hooks/useCategories";

function CategoryChips({
    categoryIds,
    size = "small",
    color = "primary",
    fallbackText = "Chưa có danh mục.",
    chipProps = {},
    sx,
}) {
    const { categories } = useCategories();

    const categoryNameById = useMemo(() => {
        const map = {};
        (categories || []).forEach((c) => {
            map[c._id || c.id] = c.name || c.title || "";
        });
        return map;
    }, [categories]);

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={sx}>
                {fallbackText}
            </Typography>
        );
    }

    return (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={sx}>
            {categoryIds.map((catId) => {
                const name = categoryNameById[catId] || catId;
                return <Chip key={catId} label={name} color={color} size={size} {...chipProps} />;
            })}
        </Stack>
    );
}

export default CategoryChips;
