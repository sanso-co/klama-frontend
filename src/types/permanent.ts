import { Show } from "./show";

export interface Permanent {
    _id?: string;
    name: string;
    description?: string;
    shows: {
        result: Show[];
        page: number;
        totalPages: number;
        totalDocs: number;
    };
}
