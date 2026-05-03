import BaseDto from "../../../common/dto/base.dto";
import z from "zod";
declare class registerDto extends BaseDto {
    static schema: z.ZodObject<{
        applicationName: z.ZodString;
        applicationDescription: z.ZodString;
        applicationUrl: z.ZodURL;
        redirectUrl: z.ZodURL;
    }, z.core.$strip>;
}
export default registerDto;
//# sourceMappingURL=register.dto.d.ts.map