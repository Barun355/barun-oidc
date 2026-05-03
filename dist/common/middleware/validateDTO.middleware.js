import BaseDto from "../dto/base.dto";
export const validateDto = (DtoClass) => {
    return (req, res, next) => {
        DtoClass.validate(req.body);
        next();
    };
};
export default validateDto;
//# sourceMappingURL=validateDTO.middleware.js.map