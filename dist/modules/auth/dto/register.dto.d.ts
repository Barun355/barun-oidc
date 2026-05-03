import BaseDto from "../../../common/dto/base.dto";
import z from "zod";
declare class registerDto extends BaseDto {
    static schema: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodEmail;
        gender: z.ZodEnum<{
            male: "male";
            female: "female";
            other: "other";
        }>;
        dateOfBirth: z.ZodCoercedDate<unknown>;
        avatarUrl: z.ZodURL;
        password: z.ZodString;
    }, z.core.$strip>;
}
export default registerDto;
//# sourceMappingURL=register.dto.d.ts.map