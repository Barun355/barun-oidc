import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
declare class loginDto extends BaseDto {
    static schema: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
}
export default loginDto;
//# sourceMappingURL=login.dto.d.ts.map