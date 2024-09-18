import { Drama } from "@/types/show";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface StateProps {
    collection: string | null;
    page: number;
    shows: Drama[];
    setCollection: (collection: string) => void;
    setPage: (payload: number | ((prevPage: number) => number)) => void;
    setShows: (newShows: Drama[] | ((currentShows: Drama[]) => Drama[])) => void;
    resetCollection: () => void;
}

export const useCollectionStore = create<StateProps>()(
    devtools(
        persist(
            (set) => ({
                collection: null,
                page: 1,
                shows: [],
                setCollection: (collection) => set({ collection }),
                setPage: (payload: number | ((prevPage: number) => number)) =>
                    set((state) => ({
                        page: typeof payload === "function" ? payload(state.page) : payload,
                    })),
                setShows: (newShows: Drama[] | ((currentShows: Drama[]) => Drama[])) =>
                    set((state) => ({
                        shows:
                            typeof newShows === "function"
                                ? newShows(state.shows)
                                : [...state.shows, ...newShows],
                    })),
                resetCollection: () => set({ page: 1, shows: [] }),
            }),
            {
                name: "collection",
            }
        )
    )
);
