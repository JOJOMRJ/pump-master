// Filter parameters
export interface FilterParams {
  types?: string[];
  areas?: string[];
}

// Pagination request parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
  filters?: FilterParams;
}

// Pagination response metadata
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
