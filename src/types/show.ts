export interface Show {
    _id: string;
    id: string;
    name: string;
    original_name: string;
    first_air_date: string;
    poster_path: string;
    genre_ids: string[];
}

export interface Collection {
    releaseDate: string;
    shows: Show[];
}

export interface CollectionResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    group: boolean;
    lists: Collection[];
}

export interface CollectionStore {
    [key: string]: CollectionResponse | null;
}
