export const initialsOf = (name = "") =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .map((s, i, a) => (i === 0 || i === a.length - 1 ? s[0] : ""))
        .join("")
        .toUpperCase();
