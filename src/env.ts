import { z } from "zod";

const schema = z.object({
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
});

export const env = schema.parse(process.env);
