
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

export interface ListResponse<T> {
    data: T[];
    pagination: PaginationParams;
}