export interface PaginationOptions {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}
