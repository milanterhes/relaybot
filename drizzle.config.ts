import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./db.sqlite",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema: "src/lib/schema.ts",
  strict: true,
  verbose: true,
  out: "./migrations",
});
