import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
class loginDto extends BaseDto {
    static schema = z.object({
        email: z.email().trim().toLowerCase(),
        password: z
            .string()
            .min(8, "Invalid password")
            .max(32, "Invalid password")
            .regex(/[A-Z]/, "Invalid password")
            .regex(/[a-z]/, "Invalid password")
            .regex(/[0-9]/, "Invalid password")
            .regex(/[@$!%*?&]/, "Invalid password"),
    });
}
export default loginDto;
//# sourceMappingURL=login.dto.js.map