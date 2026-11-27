// Storage for the API.
// - With DATABASE_URL set (Vercel / Neon): data, sessions and uploaded photos live in Postgres.
// - Without it (plain local run): data in server/data/db.json, photos in server/uploads/.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { seed } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hashToken = (t) => crypto.createHash("sha256").update(String(t)).digest("hex");

function postgresStore(connectionString) {
  const pool = new pg.Pool({ connectionString, max: 3 });

  const seedMissing = async (keys) => {
    for (const key of keys) {
      await pool.query(
        "INSERT INTO app_data (key, data) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING",
        [key, JSON.stringify(seed[key])]
      );
    }
  };

  return {
    kind: "postgres",
    async get(...keys) {
      let { rows } = await pool.query("SELECT key, data FROM app_data WHERE key = ANY($1)", [keys]);
      const missing = keys.filter((k) => !rows.some((r) => r.key === k));
      if (missing.length) {
        await seedMissing(missing);
        ({ rows } = await pool.query("SELECT key, data FROM app_data WHERE key = ANY($1)", [keys]));
      }
      const out = {};
      for (const r of rows) out[r.key] = r.data;
      return out;
    },
    async set(key, data) {
      await pool.query(
        `INSERT INTO app_data (key, data, updated_at) VALUES ($1, $2::jsonb, now())
         ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        [key, JSON.stringify(data)]
      );
    },
    async prepend(key, item) {
      await this.get(key);
      await pool.query(
        "UPDATE app_data SET data = jsonb_build_array($2::jsonb) || data, updated_at = now() WHERE key = $1",
        [key, JSON.stringify(item)]
      );
    },
    async createSession(token, expiresAt) {
      await pool.query("DELETE FROM admin_sessions WHERE expires_at < now()");
      await pool.query("INSERT INTO admin_sessions (token_hash, expires_at) VALUES ($1, $2)", [hashToken(token), expiresAt]);
    },
    async hasSession(token) {
      const { rows } = await pool.query(
        "SELECT 1 FROM admin_sessions WHERE token_hash = $1 AND expires_at > now()",
        [hashToken(token)]
      );
      return rows.length > 0;
    },
    async deleteSession(token) {
      await pool.query("DELETE FROM admin_sessions WHERE token_hash = $1", [hashToken(token)]);
    },
    async saveUpload(name, mime, buffer) {
      await pool.query("INSERT INTO uploads (name, mime, data) VALUES ($1, $2, $3)", [name, mime, buffer]);
    },
    async getUpload(name) {
      const { rows } = await pool.query("SELECT mime, data FROM uploads WHERE name = $1", [name]);
      return rows[0] || null;
    },
  };
}

function fileStore() {
  const DATA_DIR = path.join(__dirname, "data");
  const DB_FILE = path.join(DATA_DIR, "db.json");
  const UPLOAD_DIR = path.join(__dirname, "uploads");
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, "utf8")) : structuredClone(seed);
  for (const key of Object.keys(seed)) if (db[key] === undefined) db[key] = structuredClone(seed[key]);
  const save = () => {
    const tmp = DB_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  };
  save();
  const sessions = new Map();
  const MIME = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

  return {
    kind: "file",
    async get(...keys) {
      const out = {};
      for (const k of keys) out[k] = structuredClone(db[k]);
      return out;
    },
    async set(key, data) {
      db[key] = data;
      save();
    },
    async prepend(key, item) {
      db[key].unshift(item);
      save();
    },
    async createSession(token, expiresAt) {
      sessions.set(hashToken(token), expiresAt.getTime());
    },
    async hasSession(token) {
      const exp = sessions.get(hashToken(token));
      return Boolean(exp && exp > Date.now());
    },
    async deleteSession(token) {
      sessions.delete(hashToken(token));
    },
    async saveUpload(name, _mime, buffer) {
      fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);
    },
    async getUpload(name) {
      const file = path.join(UPLOAD_DIR, path.basename(name));
      if (!fs.existsSync(file)) return null;
      return { mime: MIME[path.extname(file)] || "application/octet-stream", data: fs.readFileSync(file) };
    },
  };
}

let store;
export function getStore() {
  if (!store) store = process.env.DATABASE_URL ? postgresStore(process.env.DATABASE_URL) : fileStore();
  return store;
}
