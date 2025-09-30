import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getFileDownloadURL } from "../../service/firebaseStorage";
import "./style.module.scss";

/**
 * FirebaseImg
 * Props:
 *  - fileName: path stored in Firebase
 *  - enableHoverZoom: bật tắt hiệu ứng zoom (default true)
 */
const FirebaseImg = ({
    fileName,
    alt = "",
    inputClassName,
    style,
    width = "auto",
    height = "auto",
    enableHoverZoom = true,
}) => {
    const [imgSrc, setImgSrc] = useState(null);

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
            // setClassName((prev) => prev + " d-none");
            console.error("Error fetching image:", error);
            setImgSrc(
                `https://via.placeholder.com/${width === "auto" ? 150 : width}x${height === "auto" ? 150 : height}?text=H%C3%ACnh`,
            );
        }
    };

    return (
        <LazyLoadImage
            className={`${inputClassName ?? ""}`}
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            style={{
                objectFit: "cover",
                ...style,
            }}
            effect="blur"
        />
    );
};

export default FirebaseImg;
