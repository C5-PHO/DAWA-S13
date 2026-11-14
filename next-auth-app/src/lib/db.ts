import Database from "better-sqlite3";
import path from "path";
const db = new Database(path.join(process.cwd(), "local.db"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0)`);
export default db;
