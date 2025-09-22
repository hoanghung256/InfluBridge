import { Box } from "@mui/material";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

export const icons = {
    facebook: <FacebookIcon />,
    instagram: <InstagramIcon />,
    tiktok: <TiktokIcon />,
    youtube: <YoutubeIcon />,
};

export function FacebookIcon() {
    return <FaFacebookF size={"1em"} color="#1877F2" style={{ borderRadius: "8px" }} />;
}

export function InstagramIcon() {
    return (
        <svg width="1em" height="1em">
            <defs>
                <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F58529" />
                    <stop offset="50%" stopColor="#DD2A7B" />
                    <stop offset="100%" stopColor="#8134AF" />
                </linearGradient>
            </defs>
            <FaInstagram size={"1em"} fill="url(#instaGradient)" />
        </svg>
    );
}

export function TiktokIcon() {
    return (
        <svg width="1em" height="1em">
            <defs>
                <linearGradient id="tiktokGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#69C9D0" />
                    <stop offset="100%" stopColor="#EE1D52" />
                </linearGradient>
            </defs>
            <SiTiktok size={"1em"} fill="url(#tiktokGradient)" width="50" height="50" />
        </svg>
    );
}

export function YoutubeIcon() {
    return <FaYoutube size={"1em"} color="#FF0000" style={{ borderRadius: "8px" }} />;
}

export default function AppIcon() {
    return (
        <Box
            sx={(theme) => ({
                width: 34,
                height: 34,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.contrastText",
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
            })}
        >
            <BoltOutlinedIcon fontSize="small" />
        </Box>
    );
}
