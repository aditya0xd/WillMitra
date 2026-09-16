import type { CookieOptions, Request, Response } from "express";

import { env } from "@env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createUser, getUser } from "./auth.repository.js";

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/auth/refresh-token",
  sameSite: "strict",
  secure: env.NODE_ENV === "production",
};

export function logoutService(req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    path: "/auth/refresh-token",
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export function refreshTokenService(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing" });
      return;
    }

    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      email: string;
      userId: string;
    };

    const user = getUser(payload.email);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res
      .status(200)
      .json({ accessToken, message: "Token refreshed successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function signinService(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = getUser(email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      res.status(401).json({ message: "Invalid email or password1" });
      return;
    }

    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { email: user.email, userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(200).json({
      accessToken,
      message: "User signed in successfully",
      user: { email: user.email, id: user.id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupService(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const existingUser = getUser(email);
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = createUser(email, hashedPassword);

    const accessToken = jwt.sign({ email, userId }, env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ email, userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(201).json({
      accessToken,
      message: "User created successfully",
      userId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
