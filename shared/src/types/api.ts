export type ApiResult<T> = {
  data: T;
  requestId: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
