import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Modal } from "@/components/global/Modal";
import { Play } from "@/assets/icons/Play";
import { MediaIcon } from "@/assets/icons/MediaIcon";
import { TrailerTypeTMDB } from "@/types/showDetail";

import styles from "./imagecontainer.module.scss";

interface Props {
    src: string;
    ratio?: string;
    rounded?: string;
    width?: string;
    video?: TrailerTypeTMDB[];
}

export const ImageContainer = ({ src, ratio, rounded, width, video }: Props) => {
    const [naturalRatio, setNaturalRatio] = useState<string | undefined>(ratio);

    useEffect(() => {
        if (src && src !== "no-image") {
            const img = new Image();
            img.src = src;

            img.onload = () => {
                const calculatedRatio = (img.naturalWidth / img.naturalHeight).toFixed(2);
                setNaturalRatio(calculatedRatio);
            };
        }
    }, [src]);

    const containerClasses = [
        styles.container,
        width ? styles.customWidth : "",
        rounded ? styles.rounded : "",
        ratio ? styles.customRatio : "",
    ]
        .filter(Boolean)
        .join(" ");

    const containerStyle = {
        "--custom-width": width,
        "--rounded": rounded,
        "--aspect-ratio": ratio || naturalRatio,
    } as React.CSSProperties;

    const noImage = src === "no-image";
    const [overlayOpen, setOverlayOpen] = useState(false);

    const handleModal = () => {
        setOverlayOpen(!overlayOpen);
    };

    return (
        <div className={containerClasses} style={containerStyle}>
            {noImage ? (
                <div className={styles.placeholder}>
                    <MediaIcon />
                </div>
            ) : (
                <img src={src} alt="" />
            )}
            {video && (
                <div className={styles.playIcon} onClick={handleModal}>
                    <Play fill="#eee" />
                </div>
            )}
            <Modal hideButton open={overlayOpen} handleClose={handleModal}>
                <div className={styles.videoplayer}>
                    <ReactPlayer
                        controls
                        className={styles.reactPlayer}
                        url={`https://www.youtube.com/watch?v=${video?.[0]?.key}`}
                        width="100%"
                        height="100%"
                    />
                </div>
            </Modal>
        </div>
    );
};
