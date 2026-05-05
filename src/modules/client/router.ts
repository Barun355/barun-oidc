import { Router } from "express";
import * as clientController from "./controller.ts";
import validateDto from "../../common/middleware/validateDTO.middleware.ts";
import registerDto from "./dto/register.dto.ts";

const router: Router = Router();

router.get("/register", (req, res) => {
  clientController.getRegister(req, res);
});

router.post(
  "/register",
  validateDto(registerDto),
  clientController.registerClientApp,
);

export default router;
