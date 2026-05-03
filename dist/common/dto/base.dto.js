import z from "zod";
import ApiError from "../utils/api-error";
class BaseDto {
    static schema = z.object({});
    static validate(data) {
        const parsedData = this.schema.safeParse(data);
        if (parsedData.error) {
            const formatedError = parsedData.error.issues.map((issue) => ({
                path: issue.path,
                message: issue.message,
            }));
            throw ApiError.badRequest("Invalid data", formatedError);
        }
        return parsedData.data;
    }
}
export default BaseDto;
//# sourceMappingURL=base.dto.js.map