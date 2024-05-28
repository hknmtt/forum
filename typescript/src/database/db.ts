import DataBaseConstructor, { Database } from "better-sqlite3";
import config from "../config";

const db: Database = new DataBaseConstructor(config.db.path);

export default db;
