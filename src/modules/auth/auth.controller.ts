import { type Request, type Response } from "express";

import {
  logoutService,
  refreshTokenService,
  signinService,
  signupService,
} from "./auth.services.js";

export function logoutController(req: Request, res: Response) {
  logoutService(req, res);
}

export function refreshTokenController(req: Request, res: Response) {
  refreshTokenService(req, res);
}

export async function signinController(req: Request, res: Response) {
  await signinService(req, res);
}

export async function signupController(req: Request, res: Response) {
  await signupService(req, res);
}
