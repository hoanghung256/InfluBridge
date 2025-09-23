import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getFileDownloadURL } from "../../service/firebaseStorage";
import "./style.module.scss";

/**
 * FireBaseImg
 * Props:
 *  - fileName: path stored in Firebase
 *  - enableHoverZoom: bật tắt hiệu ứng zoom (default true)
 */
const FireBaseImg = ({
    fileName,
    alt = "",
    inputClassName,
    style,
    width = "auto",
    height = "auto",
    enableHoverZoom = true,
}) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [className, setClassName] = useState(inputClassName ?? "");

    useEffect(() => {
        if (fileName) {
            getImage();
        }
    }, [fileName]);

    const getImage = async () => {
        try {
            const url = await getFileDownloadURL(fileName);
            setImgSrc(url);
        } catch (error) {
            setClassName((prev) => prev + " d-none");
            console.error("Error fetching image:", error);
            setImgSrc(
                `https://via.placeholder.com/${width === "auto" ? 150 : width}x${height === "auto" ? 150 : height}?text=H%C3%ACnh`,
            );
        }
    };

    return (
        <div
            className={`fb-img-wrapper ${enableHoverZoom ? "hover-zoom" : ""}`}
            style={{
                width,
                height,
                display: width === "auto" || height === "auto" ? "inline-block" : "block",
                overflow: "hidden",
                borderRadius: 8,
            }}
        >
            <LazyLoadImage
                className={`fb-img ${imgSrc ? className : "d-none"}`}
                src={imgSrc}
                alt={alt}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    ...style,
                }}
                effect="blur"
            />
        </div>
    );
};

export default FireBaseImg;
