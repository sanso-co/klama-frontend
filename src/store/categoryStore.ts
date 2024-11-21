import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CategoryCollectionResponse } from "@/types/category";

interface CategoryCollections {
    [key: string]: CategoryCollectionResponse | null;
}

interface LastFetched {
    [key: string]: number | null;
}

interface CategoryProps {
    categoryCollections: CategoryCollections;
    setCategoryCollection: (id: string, data: CategoryCollectionResponse) => void;
    getCollection: (id: string) => CategoryCollectionResponse | null;
    isLoading: { [id: string]: boolean };
    setIsLoading: (id: string, loading: boolean) => void;
    errors: { [id: string]: Error | null };
    setError: (id: string, error: Error | null) => void;
    lastFetched: LastFetched;
    setLastFetched: (id: string, timestamp: number) => void;
    isCacheValid: (id: string, expirationTime?: number) => boolean;
}

export const useCategoryStore = create<CategoryProps>()(
    devtools(
        (set, get) => ({
            categoryCollections: {},
            setCategoryCollection: (id, data) => {
                set((state) => ({
                    categoryCollections: { ...state.categoryCollections, [id]: data },
                }));
                get().setLastFetched(id, Date.now());
            },
            getCollection: (id) => get().categoryCollections[id] || null,
            isLoading: {},
            setIsLoading: (id, loading) =>
                set((state) => ({
                    isLoading: {
                        ...state.isLoading,
                        [id]: loading,
                    },
                })),
            errors: {},
            setError: (id, error) =>
                set((state) => ({
                    errors: {
                        ...state.errors,
                        [id]: error,
                    },
                })),
            lastFetched: {},
            setLastFetched: (id, timestamp) =>
                set((state) => ({
                    lastFetched: { ...state.lastFetched, [id]: timestamp },
                })),
            isCacheValid: (id, expirationTime = 60000) => {
                const timestamp = get().lastFetched[id];
                return timestamp !== null && Date.now() - timestamp < expirationTime;
            },
        }),
        {
            name: "category",
        }
    )
);
