import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
class refreshTokenDto extends BaseDto {
    static schema = z.object({
        refreshToken: z.string(),
        clientSecret: z.string(),
    });
}
export default refreshTokenDto;
//# sourceMappingURL=refreshToken.dto.js.map