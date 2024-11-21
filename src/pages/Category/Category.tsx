import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { useCategoryData } from "@/hooks/api/useCategoryData";
import { useCategoryCollectionStore } from "@/store/categoryCollectionStore";
import { formatName } from "@/helpers/formatName";

import { ShowCard } from "@/components/feature/ShowCard";
import { Header } from "@/components/global/Header";
import { Spinner } from "@/components/global/Spinner";
import { SEO } from "@/components/global/SEO";

import { CategoryType } from "@/types/category";
import { LeanShowType } from "@/types/show";

import styles from "./category.module.scss";
import layout from "@/assets/styles/layout.module.scss";

const Collection = () => {
    const { categoryType, categoryName, categoryId } = useParams();
    const { collection, page, shows, setCollection, setPage, setShows, resetCollection } =
        useCategoryCollectionStore();

    const [localIsLoading, setLocalIsLoading] = useState(false);

    // Handle collection reset and initialization
    useEffect(() => {
        if (
            (categoryName && categoryName !== collection) ||
            (categoryType === "air" && categoryId !== collection)
        ) {
            resetCollection();
            setCollection(categoryName as string);
        } else if (!collection && categoryName) {
            setCollection(categoryName);
        }
    }, [categoryName, categoryType, categoryId, collection, resetCollection, setCollection]);

    // Fetch data using the hybrid method
    const { categoryCollection, isLoading: dataLoading } = useCategoryData(
        categoryType as CategoryType,
        categoryId as string,
        page
    );

    useEffect(() => {
        if (categoryCollection?.shows?.results) {
            // Deduplicate shows before updating the store
            setShows((existingShows) => {
                const newShows = categoryCollection.shows.results.filter(
                    (newShow) =>
                        !existingShows.some((existingShow) => existingShow.id === newShow.id)
                );
                return [...existingShows, ...newShows];
            });
        }
    }, [categoryCollection, setShows]);

    // Fetch more data when infinite scroll triggers
    const fetchMoreData = useCallback(() => {
        if (!dataLoading && !localIsLoading) {
            setLocalIsLoading(true);
            setTimeout(() => {
                setPage((prevPage) => prevPage + 1);
                setLocalIsLoading(false);
            }, 500);
        }
    }, [dataLoading, localIsLoading, setPage]);

    return (
        <>
            <SEO
                title={categoryName || "Collection"}
                description={
                    categoryName ||
                    `Discover ${categoryName || "our collection of"} Korean dramas on K-lama.`
                }
            />
            <div className={`${styles.container} ${layout.default} ${layout.max}`}>
                <div className={styles.header}>
                    <Header
                        title={formatName(categoryName || "")}
                        description={
                            categoryType === "provider"
                                ? `Shows streaming on ${formatName(categoryName || "")}`
                                : `Shows with ${categoryType} ${formatName(categoryName || "")}`
                        }
                    />
                </div>

                <InfiniteScroll
                    dataLength={shows.length}
                    next={fetchMoreData}
                    hasMore={
                        !!categoryCollection &&
                        !!categoryCollection.shows &&
                        !!categoryCollection.shows.totalPages &&
                        categoryCollection.shows.page < categoryCollection.shows.totalPages
                    }
                    loader={<Spinner />}
                    endMessage={
                        <div className={styles.endMessage}>
                            <p>Yay! You have seen it all</p>
                        </div>
                    }
                >
                    <div className={styles.grid}>
                        {shows.map((show: LeanShowType) => (
                            <ShowCard show={show} key={show.id} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </>
    );
};

export default Collection;
