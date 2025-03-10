import { create } from "zustand";
import { ProviderType } from "@/types/provider";

interface ProviderCollections {
    [id: string]: ProviderType | null;
}

interface ProviderProps {
    providerCollections: ProviderCollections;
    setProviderCollection: (id: string, data: ProviderType) => void;
    isLoading: { [id: string]: boolean };
    setIsLoading: (id: string, loading: boolean) => void;
    errors: { [id: string]: Error | null };
    setError: (id: string, error: Error | null) => void;
}

export const useProviderStore = create<ProviderProps>((set) => ({
    providerCollections: {},
    setProviderCollection: (id, data) =>
        set((state) => ({
            providerCollections: {
                ...state.providerCollections,
                [id]: data,
            },
        })),
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
}));
