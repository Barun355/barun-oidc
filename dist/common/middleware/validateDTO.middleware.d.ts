import type { Request, Response, NextFunction } from "express";
import BaseDto from "../dto/base.dto";
export declare const validateDto: (DtoClass: typeof BaseDto) => (req: Request, res: Response, next: NextFunction) => void;
export default validateDto;
//# sourceMappingURL=validateDTO.middleware.d.ts.map