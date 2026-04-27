export type SortOrder = "asc" | "desc";

export interface TableColumn<TData> {
    key: keyof TData | string;
    header: string;
    sortable?: boolean;
    width?: string;
    className?: string;
    render?: (value: unknown, row: TData) => React.ReactNode;
}

export interface TableSortState {
    column: string;
    direction: SortOrder;
}

export interface TableProps<TData> {
    columns: TableColumn<TData>[];
    data: TData[];
    isLoading?: boolean;
    emptyMessage?: string;
    onSort?: (sort: TableSortState) => void;
    sortState?: TableSortState;
    className?: string;
    rowKey: keyof TData;
    onRowClick?: (row: TData) => void;
}

export interface TablePaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}