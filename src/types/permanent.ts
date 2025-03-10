import { LeanShowType } from "./show";

export interface PermanentType {
    _id?: string;
    name: string;
    description?: string;
    shows: {
        result: LeanShowType[];
        page: number;
        totalPages: number;
        totalDocs: number;
    };
}
