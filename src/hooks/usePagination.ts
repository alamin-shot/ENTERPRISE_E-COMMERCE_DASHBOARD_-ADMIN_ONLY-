"use client";

import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
    total: number;
    initialPage?: number;
    pageSize?: number;
}

interface UsePaginationReturn {
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    from: number;
    to: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    setPageSize: (size: number) => void;
}

export function usePagination({
    total,
    initialPage = 1,
    pageSize: initialPageSize = 10,
}: UsePaginationProps): UsePaginationReturn {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const from = Math.min((page - 1) * pageSize + 1, total);
    const to = Math.min(page * pageSize, total);

    const goToPage = useCallback((p: number) => {
        setPage(Math.max(1, Math.min(p, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
    const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);
    const firstPage = useCallback(() => goToPage(1), [goToPage]);
    const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

    const handleSetPageSize = useCallback((size: number) => {
        setPageSize(size);
        setPage(1);
    }, []);

    return {
        page, pageSize, totalPages,
        hasNext, hasPrev, from, to,
        goToPage, nextPage, prevPage,
        firstPage, lastPage,
        setPageSize: handleSetPageSize,
    };
}