import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
declare class generateTokenDto extends BaseDto {
    static schema: z.ZodObject<{
        authorizationCode: z.ZodString;
        clientSecret: z.ZodString;
    }, z.core.$strip>;
}
export default generateTokenDto;
//# sourceMappingURL=generateToken.dto.d.ts.map