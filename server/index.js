// Local MD Groups server: runs the API (server/app.js) and, after `npm run build`, serves the website.
// On Vercel the same API runs as a function from api/index.js instead.

import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const PUBLIC_UPLOADS = path.join(ROOT, "public", "uploads");

// Load .env and .env.development.local (simple KEY=value lines) before the app reads them.
for (const name of [".env", ".env.development.local"]) {
  const envFile = path.join(ROOT, name);
  if (!fs.existsSync(envFile)) continue;
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { app, handleErrors } = await import("./app.js");
const PORT = process.env.PORT || 3001;

const server = express();
server.use("/uploads", express.static(PUBLIC_UPLOADS, { maxAge: "7d" }));
server.use(app);

if (fs.existsSync(DIST_DIR)) {
  server.use(express.static(DIST_DIR));
  server.get(/^(?!\/api|\/uploads).*/, (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
}
handleErrors(server);

server.listen(PORT, () => console.log(`MD Groups server running on http://localhost:${PORT}`));
