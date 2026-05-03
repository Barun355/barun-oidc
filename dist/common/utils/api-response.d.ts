import type { Response } from "express";
declare class ApiResponse {
    static ok(res: Response, message: string, data?: unknown): Response<any, Record<string, any>>;
    static created(res: Response, message: string, data?: unknown): Response<any, Record<string, any>>;
    static html(res: Response, html: string, type?: "error" | "success"): void;
}
export default ApiResponse;
//# sourceMappingURL=api-response.d.ts.map