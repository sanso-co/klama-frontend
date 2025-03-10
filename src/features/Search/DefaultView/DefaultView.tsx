import { usePeriodicCollection } from "@/hooks/api/collection/usePeriodicCollection";

import { collectionId } from "@/helpers/constants/collectionId";
import { LeanShowType } from "@/types/show";

import { SearchCard } from "@/components/feature/SearchCard";

import styles from "./default.module.scss";

interface Props {
    handleClick: (id: number) => void;
}

export const DefaultView = ({ handleClick }: Props) => {
    const { data: trending } = usePeriodicCollection(collectionId.TRENDING_NOW || "", "latest");

    return (
        <div className={styles.viewContainer}>
            <h3 className={styles.header}>Trending Dramas</h3>
            {trending?.shows?.slice(0, 3).map((show: LeanShowType) => (
                <SearchCard show={show} key={show.id} handleClick={() => handleClick(show.id)} />
            ))}
        </div>
    );
};
