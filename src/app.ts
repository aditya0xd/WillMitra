import type { Routes } from "@interface/routes.interface.js";

import { env } from "@env.js";
import cors from "cors";
import express from "express";

const { NODE_ENV, PORT } = env;

export class App {
  public app: express.Application;
  public env: string;
  public port: number | string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT;

    this.app.use(cors());
    this.app.use(express.json());

    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }
}
