import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET || "secret",
  db: {
    path: process.env.SQLITE_PATH || "src/database/db.sqlite3",
  },
};

export default config;
