import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDetails } from "@/hooks/api/details/useDetails";
import { useTrailerVideo } from "@/hooks/api/details/useTrailerVideo";

import { getCroppedImageUrl, getKrImageUrl } from "@/services/image-url";

import { SEO } from "@/components/global/SEO";
import { Loader } from "@/components/global/Loader";
import { ImageContainer } from "@/components/global/ImageContainerNatural";
import { Info } from "@/features/Details/Info";
import { Cast } from "@/features/Details/Cast";
import { Crew } from "@/features/Details/Crew";
import { Status } from "@/features/Details/Status";
import { Keyword } from "@/features/Details/Keyword";
import { Provider } from "@/features/Details/Provider";
import { OriginalStory } from "@/features/Details/OriginalStory";
import { Recommendations } from "@/features/Details/Recommendations";

import styles from "./details.module.scss";
import layout from "@/assets/styles/layout.module.scss";

const Details = () => {
    const { id } = useParams<{ id: string }>();
    const { details, error, isLoading } = useDetails(Number(id));

    const {
        trailer,
        isLoading: trailerLoading,
        error: trailerError,
    } = useTrailerVideo(id as string);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const getImageUrl = () => {
        if (details?.poster_path?.US?.path ?? "" !== "") {
            return getCroppedImageUrl(details?.poster_path.US.path);
        } else if (details?.poster_path?.KR?.path ?? "" !== "") {
            return getKrImageUrl(details?.poster_path?.KR?.path);
        } else {
            return "";
        }
    };

    if (isLoading || !details)
        return (
            <div className={`${styles.loaderContainer} ${styles.top} ${layout.max}`}>
                <Loader />
            </div>
        );
    if (error) return <div>Failed to load show details</div>;

    return (
        <>
            <SEO
                pageType="details"
                name={details?.name}
                id={details?.id}
                keywords={details?.keywords}
                image={getImageUrl()}
            />
            <>
                <div className={`${styles.container} ${styles.top} ${layout.max}`}>
                    <div className={styles.image}>
                        <ImageContainer
                            src={getImageUrl()}
                            video={
                                details.trailer?.length > 0
                                    ? details.trailer
                                    : !trailerLoading && !trailerError
                                    ? trailer?.results
                                    : undefined
                            }
                        />
                    </div>
                    <div className={styles.details}>
                        <Info data={details} />
                        {id && <Status id={id} />}
                        {id && <Provider id={id} />}
                        <Keyword keywords={details?.keywords} />
                    </div>
                </div>
                {id && <Cast id={id} />}
                {id && <Crew id={id} />}
                {id && <OriginalStory id={id} />}
                <Recommendations showId={Number(details?.id)} />
            </>
        </>
    );
};

export default Details;
