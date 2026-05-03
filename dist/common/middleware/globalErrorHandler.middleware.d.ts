import type { Request, Response, NextFunction } from "express";
declare function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.middleware.d.ts.map