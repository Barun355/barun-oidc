import z from "zod";
import type { Request } from "express";
declare class BaseDto {
    static schema: z.ZodObject<{}, z.core.$strip>;
    static validate(data: Request["body"]): Record<string, never>;
}
export default BaseDto;
//# sourceMappingURL=base.dto.d.ts.map