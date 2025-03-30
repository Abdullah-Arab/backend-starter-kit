type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: string | Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const formatResponse = <T>(
  status: "success" | "error",
  message: string,
  data?: T,
  pagination?: ApiResponse<T>["pagination"],
  error?: string | Record<string, any>
): ApiResponse<T> => {
  return {
    status,
    message,
    ...(data && { data }),
    ...(pagination && { pagination }),
    ...(error && { error }),
  };
};
