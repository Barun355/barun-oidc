declare class ApiError extends Error {
    code: string;
    statusCode: number;
    details: Array<unknown>;
    constructor(code: string, message: string, statusCode: number, detail: Array<unknown>);
    static badRequest(message: string, details?: Array<unknown>): ApiError;
    static internal(message: string, details?: Array<unknown>): ApiError;
    static invalidRequest(message: string, details?: Array<unknown>): ApiError;
    static unauthorized(message: string, details?: Array<unknown>): ApiError;
    static forbidden(message: string, details?: Array<unknown>): ApiError;
    static notFound(message: string, details?: Array<unknown>): ApiError;
    static methodNotAllowed(message: string, details?: Array<unknown>): ApiError;
    static conflict(message: string, details?: Array<unknown>): ApiError;
    static unprocessable(message: string, details?: Array<unknown>): ApiError;
    static tooManyRequests(message: string, details?: Array<unknown>): ApiError;
    static internalServerError(message: string, details?: Array<unknown>): ApiError;
    static serviceUnavailable(message: string, details?: Array<unknown>): ApiError;
}
export default ApiError;
//# sourceMappingURL=api-error.d.ts.map