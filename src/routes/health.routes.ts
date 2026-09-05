import type { Routes } from "@interface/routes.interface.js";

import { type Request, type Response, Router } from "express";

class HealthRoutes implements Routes {
  public path = "/health";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "OK" });
    });
  }
}

export default HealthRoutes;
