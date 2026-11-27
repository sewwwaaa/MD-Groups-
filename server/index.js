// MD Groups API server
// - Public:  GET /api/site, GET /api/properties, GET /api/vehicles, POST /api/enquiries
// - Admin:   POST /api/admin/login, and everything under /api/admin/* (needs login token)
// Data is stored in server/data/db.json, uploaded images in server/uploads/.

import express from "express";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seed } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const DIST_DIR = path.join(__dirname, "..", "dist");

// ---- Load .env (simple KEY=value lines) ----
const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const PORT = process.env.PORT || 3001;
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mdgroups123";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("⚠  Using the default admin password. Set ADMIN_PASSWORD in the .env file before going live.");
}

// ---- Tiny JSON database ----
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
let db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, "utf8")) : structuredClone(seed);
for (const key of Object.keys(seed)) if (db[key] === undefined) db[key] = structuredClone(seed[key]);
const save = () => {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
};
save();

// ---- Auth (in-memory session tokens, 7 days) ----
const sessions = new Map();
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const s = sessions.get(token);
  if (!s || s.expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Please log in again." });
  }
  next();
}

// ---- Helpers ----
const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "item";
const uniqueId = (list, base) => {
  let id = slugify(base), n = 2;
  while (list.some((x) => x.id === id)) id = `${slugify(base)}-${n++}`;
  return id;
};
const toList = (v) =>
  Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean)
  : String(v || "").split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);

const LISTING_FIELDS = {
  properties: {
    text: ["title", "location", "city", "deal", "type", "size", "land", "priceUnit", "image", "description"],
    num: ["price", "beds", "baths"],
  },
  vehicles: {
    text: ["title", "make", "model", "category", "deal", "mileage", "fuel", "transmission", "location", "image", "description"],
    num: ["price", "year"],
  },
};
function cleanListing(kind, body) {
  const f = LISTING_FIELDS[kind];
  const out = {};
  for (const k of f.text) if (body[k] !== undefined && body[k] !== null && String(body[k]).trim() !== "") out[k] = String(body[k]).trim();
  for (const k of f.num) if (body[k] !== undefined && body[k] !== "" && !isNaN(Number(body[k]))) out[k] = Number(body[k]);
  out.features = toList(body.features);
  out.featured = Boolean(body.featured);
  out.hidden = Boolean(body.hidden);
  return out;
}

// ---- App ----
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

// Public
app.get("/api/site", (_req, res) => res.json({ settings: db.settings, team: db.team }));
for (const kind of ["properties", "vehicles"]) {
  app.get(`/api/${kind}`, (_req, res) => res.json(db[kind].filter((x) => !x.hidden)));
}
app.post("/api/enquiries", (req, res) => {
  const { name, phone, email, interest, message, website } = req.body || {};
  if (website) return res.json({ ok: true }); // spam honeypot
  if (!String(name || "").trim() || !String(phone || "").trim()) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const clip = (v, n) => String(v || "").trim().slice(0, n);
  db.enquiries.unshift({
    id: crypto.randomUUID(),
    name: clip(name, 100), phone: clip(phone, 30), email: clip(email, 120),
    interest: clip(interest, 60), message: clip(message, 3000),
    createdAt: new Date().toISOString(), read: false,
  });
  save();
  res.json({ ok: true });
});

// Admin: login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!safeEqual(username, ADMIN_USER) || !safeEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Wrong username or password." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { expires: Date.now() + SESSION_MS });
  res.json({ token });
});
app.post("/api/admin/logout", (req, res) => {
  sessions.delete((req.headers.authorization || "").replace(/^Bearer /, ""));
  res.json({ ok: true });
});

const admin = express.Router();
admin.use(requireAdmin);

admin.get("/summary", (_req, res) =>
  res.json({
    properties: db.properties.length,
    vehicles: db.vehicles.length,
    enquiries: db.enquiries.length,
    unread: db.enquiries.filter((e) => !e.read).length,
    latest: db.enquiries.slice(0, 5),
  })
);

// Listings CRUD (properties & vehicles)
for (const kind of ["properties", "vehicles"]) {
  admin.get(`/${kind}`, (_req, res) => res.json(db[kind]));
  admin.post(`/${kind}`, (req, res) => {
    const item = cleanListing(kind, req.body || {});
    if (!item.title || item.price === undefined) return res.status(400).json({ error: "Title and price are required." });
    item.id = uniqueId(db[kind], item.title);
    db[kind].unshift(item);
    save();
    res.status(201).json(item);
  });
  admin.put(`/${kind}/:id`, (req, res) => {
    const i = db[kind].findIndex((x) => x.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found." });
    const item = cleanListing(kind, req.body || {});
    if (!item.title || item.price === undefined) return res.status(400).json({ error: "Title and price are required." });
    db[kind][i] = { ...item, id: req.params.id };
    save();
    res.json(db[kind][i]);
  });
  admin.delete(`/${kind}/:id`, (req, res) => {
    db[kind] = db[kind].filter((x) => x.id !== req.params.id);
    save();
    res.json({ ok: true });
  });
}

// Enquiries
admin.get("/enquiries", (_req, res) => res.json(db.enquiries));
admin.patch("/enquiries/:id", (req, res) => {
  const e = db.enquiries.find((x) => x.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Not found." });
  e.read = Boolean(req.body?.read);
  save();
  res.json(e);
});
admin.delete("/enquiries/:id", (req, res) => {
  db.enquiries = db.enquiries.filter((x) => x.id !== req.params.id);
  save();
  res.json({ ok: true });
});

// Team / directors
admin.put("/team/:id", (req, res) => {
  const m = db.team.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Not found." });
  for (const k of ["name", "role", "bio", "photo"]) if (typeof req.body?.[k] === "string") m[k] = req.body[k].trim();
  save();
  res.json(m);
});

// Settings
admin.put("/settings", (req, res) => {
  for (const k of Object.keys(seed.settings)) if (typeof req.body?.[k] === "string") db.settings[k] = req.body[k].trim();
  save();
  res.json(db.settings);
});

// Image upload
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[file.mimetype];
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});
admin.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Please choose a JPG, PNG or WEBP image under 8 MB." });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use("/api/admin", admin);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

// Production: serve the built website
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api|\/uploads).*/, (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.code === "LIMIT_FILE_SIZE" ? "Image is too large (max 8 MB)." : "Server error." });
});

app.listen(PORT, () => console.log(`MD Groups server running on http://localhost:${PORT}`));
