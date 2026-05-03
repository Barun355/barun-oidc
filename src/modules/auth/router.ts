import { Router } from "express";
import * as authController from "./controller.ts"
import validateDto from "../../common/middleware/validateDTO.middleware.ts";
import loginDto from "./dto/login.dto.ts";
import registerDto from "./dto/register.dto.ts";
import { verifyClientId } from "./middleware.ts";
import generateTokenDto from "./dto/generateToken.dto.ts";
import refreshTokenDto from "./dto/refreshToken.dto.ts";


const router: Router = Router();

router.get("/sign-in", verifyClientId, authController.getSignIn)
router.get("/sign-up", authController.getSignUp);

router.post("/sign-in", verifyClientId, validateDto(loginDto), authController.signInUser)
router.post("/sign-up", validateDto(registerDto), authController.signUpUser)

router.post("/token", verifyClientId, validateDto(generateTokenDto), authController.generateToken)


router.get("/userinfo", authController.getUserInfo);

router.post(
  "/refresh-token",
  validateDto(refreshTokenDto),
  authController.refreshToken,
);

export default router;
