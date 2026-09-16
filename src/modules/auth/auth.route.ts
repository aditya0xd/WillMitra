import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  logoutController,
  refreshTokenController,
  signinController,
  signupController,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/refresh-token", refreshTokenController);
authRouter.post("/signin", signinController);
authRouter.post("/signup", signupController);
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
