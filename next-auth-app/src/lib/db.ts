import Database from "better-sqlite3";
import path from "path";
import { Pool } from "pg";
export type User = { id: number; name: string; email: string; password: string; attempts: number; locked_until: number };
let local: Database.Database | undefined;
let pool: Pool | undefined;
let initialized: Promise<void> | undefined;
function sqlite() {
  if (!local) { local = new Database(path.join(process.cwd(), "local.db")); local.pragma("journal_mode = WAL"); local.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0)"); }
  return local;
}
async function postgres() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no configurada");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  initialized ??= pool.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, locked_until BIGINT NOT NULL DEFAULT 0)").then(() => undefined).catch(error => { initialized = undefined; throw error; });
  await initialized; return pool;
}
function remote() { if (process.env.VERCEL && !process.env.DATABASE_URL) throw new Error("DATABASE_URL no configurada"); return Boolean(process.env.DATABASE_URL); }
export async function findUser(email: string): Promise<User | undefined> {
  if (remote()) { const result = await (await postgres()).query("SELECT * FROM users WHERE email = $1", [email]); const row = result.rows[0]; return row ? {...row, locked_until: Number(row.locked_until)} : undefined; }
  return sqlite().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}
export async function createUser(name: string, email: string, password: string) {
  if (remote()) { await (await postgres()).query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",[name,email,password]); return; }
  sqlite().prepare("INSERT INTO users (name,email,password) VALUES (?,?,?)").run(name,email,password);
}
export async function failLogin(id: number) {
  const now = Date.now(), until = now + 900000;
  if (remote()) { await (await postgres()).query("UPDATE users SET attempts = CASE WHEN locked_until > 0 AND locked_until <= $1 THEN 1 ELSE attempts + 1 END, locked_until = CASE WHEN (CASE WHEN locked_until > 0 AND locked_until <= $1 THEN 1 ELSE attempts + 1 END) >= 5 THEN $2 ELSE 0 END WHERE id = $3",[now,until,id]); return; }
  sqlite().prepare("UPDATE users SET attempts = CASE WHEN locked_until > 0 AND locked_until <= ? THEN 1 ELSE attempts + 1 END, locked_until = CASE WHEN (CASE WHEN locked_until > 0 AND locked_until <= ? THEN 1 ELSE attempts + 1 END) >= 5 THEN ? ELSE 0 END WHERE id = ?").run(now,now,until,id);
}
export async function resetLogin(id: number) {
  if (remote()) { await (await postgres()).query("UPDATE users SET attempts=0, locked_until=0 WHERE id=$1",[id]); return; }
  sqlite().prepare("UPDATE users SET attempts=0, locked_until=0 WHERE id=?").run(id);
}
