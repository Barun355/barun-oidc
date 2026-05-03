import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
declare class refreshTokenDto extends BaseDto {
    static schema: z.ZodObject<{
        refreshToken: z.ZodString;
        clientSecret: z.ZodString;
    }, z.core.$strip>;
}
export default refreshTokenDto;
//# sourceMappingURL=refreshToken.dto.d.ts.map