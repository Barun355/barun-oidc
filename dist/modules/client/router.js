import { Router } from "express";
import * as clientController from "./controller";
import validateDto from "../../common/middleware/validateDTO.middleware";
import registerDto from "./dto/register.dto";
const router = Router();
router.get("/register", (req, res) => {
    clientController.getRegister(req, res);
});
router.post("/register", validateDto(registerDto), clientController.registerClientApp);
export default router;
//# sourceMappingURL=router.js.map