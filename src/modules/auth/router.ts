import { Router } from "express";
import * as authController from "./controller"
import validateDto from "../../common/middleware/validateDTO.middleware";
import loginDto from "./dto/login.dto";
import registerDto from "./dto/register.dto";
import { verifyClientId } from "./middleware";
import generateTokenDto from "./dto/generateToken.dto";
import refreshTokenDto from "./dto/refreshToken.dto";


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
