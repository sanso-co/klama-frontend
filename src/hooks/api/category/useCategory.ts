import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

import { CategoryCollectionResponse, CategoryType } from "@/types/category";
import { SortType } from "@/types/sort";

type ApiService = (
    category: string | undefined,
    id: string,
    page: number,
    sort: string
) => Promise<CategoryCollectionResponse>;

export const useCategory = (
    categoryType: CategoryType,
    id: string,
    page: number,
    sort: SortType
) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const limit = isMobile ? 10 : 30;

    const fetchMap: Record<CategoryType, ApiService> = {
        genre: () => apiService.getCategoryList(categoryType, id, page, limit, sort),
        year: () => apiService.getCategoryList(categoryType, id, page, limit, sort),
        provider: () => apiService.getProviderCollectionDetails(id, page, limit, sort),
        keyword: () => apiService.getCategoryList(categoryType, id, page, limit, sort),
        cast: () => apiService.getPersonDetails(id, page, limit, sort),
        crew: () => apiService.getCreditDetails(id, page, limit, sort),
    };

    const fetchMethod = fetchMap[categoryType];

    if (!fetchMethod) {
        throw new Error(`Unsupported category type: ${categoryType}`);
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return useQuery({
        queryKey: [categoryType, id, page, sort],
        queryFn: () => fetchMethod(categoryType, id, page, sort),
        enabled: !!id,
    });
};
