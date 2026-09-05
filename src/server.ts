import { App } from "@app.js";

import HealthRoutes from "./routes/health.routes.js";

const server = new App([new HealthRoutes()]);

server.listen();
