import { InfiniteData } from "@tanstack/react-query";
import { ApiResponse } from "openapi-typescript-fetch";

/*
 * TEMPLATE: UPDATE `DataPagination` TO MATCH SHAPE FROM BACKEND
 */
export type DataPagination = {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
};

export type PaginatedData<I> = {
    data: I[];
    pagination: DataPagination;
};

export type PaginationDataSet<I> = InfiniteData<ApiResponse<PaginatedData<I>>>;

export const getNextPageParam = <I>(lastPage: ApiResponse<PaginatedData<I>>) => {
    try {
        const { lastPage: prevPage, currentPage } = lastPage.data.pagination;
        if (prevPage > currentPage) return currentPage + 1;
    } catch {
        return undefined;
    }
};

export const getItemsFromPagination = <I>(data: PaginationDataSet<I> | undefined): I[] => {
    if (!data || !data.pages) return [];
    const pages = data.pages.map(page => page.data);
    if (!pages) return [];
    const items = pages.flatMap(page => page.data);
    return items;
};

interface Pagination {
    currentPage: number;
    lastPage: number;
}

interface LastPageResponse {
    data: {
        pagination: Pagination;
    };
}

export const getNextPageParamFunction = (lastPage: LastPageResponse): number | undefined => {
    const currentPage = lastPage.data.pagination.currentPage;
    const lastPageNumber = lastPage.data.pagination.lastPage;
    return currentPage + 1 <= lastPageNumber ? currentPage + 1 : undefined;
};
