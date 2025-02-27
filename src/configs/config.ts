import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017",

  PASSWORD_SALT: process.env.PASSWORD_SALT || 12,

  ACCESS_SECRET:
    process.env.ACCESS_SECRET || "ultra-secret-key-for-access-secret-jwt-token",
  ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || "24h",
  REFRESH_SECRET:
    process.env.REFRESH_SECRET ||
    "ultra-secret-key-for-refresh-secret-jwt-token",
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "30d",

  ACTIVATE_SECRET:
    process.env.ACTIVATE_SECRET || "action-ultra-activate-secret-token",
  FORGOT_SECRET:
    process.env.FORGOT_SECRET || "action-ultra-forgot-secret-token",

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL || "noreply@noreply.com",
  NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD || "test",

  FRONT_URL: process.env.FRONT_URL || "http://localhost:3000",
};
