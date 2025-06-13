export interface ValidationError {
  path: string;
  message: string;
}

export interface ErrorResponse {
  status: string;
  errors: ValidationError[];
}

export const formatValidationErrors = (
  errorResponse: ErrorResponse
): string => {
  return errorResponse.errors
    .map((err) => {
      return err.message;
    })
    .join('<br>');
};
