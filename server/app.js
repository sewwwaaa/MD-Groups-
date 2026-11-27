// MD Groups API (shared by the local server and the Vercel function in api/index.js)
// - Public:  GET /api/site, GET /api/properties, GET /api/vehicles, POST /api/enquiries
// - Admin:   POST /api/admin/login, and everything under /api/admin/* (needs login token)
// - Photos:  GET /uploads/:name (photos uploaded from the admin portal)

import express from "express";
import multer from "multer";
import crypto from "node:crypto";
import { seed } from "./seed.js";
import { getStore } from "./store.js";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mdgroups123";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("Using the default admin password. Set ADMIN_PASSWORD before going live.");
}

const store = getStore();
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
// Vercel functions accept request bodies up to 4.5 MB.
const MAX_UPLOAD = 4 * 1024 * 1024;

const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};
const bearer = (req) => (req.headers.authorization || "").replace(/^Bearer /, "");

async function requireAdmin(req, res, next) {
  const token = bearer(req);
  if (!token || !(await store.hasSession(token))) {
    return res.status(401).json({ error: "Please log in again." });
  }
  next();
}

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

export const app = express();
app.use(express.json({ limit: "1mb" }));

// Photos uploaded from the admin portal
const UPLOAD_NAME = /^[\w-]+\.(jpg|png|webp)$/;
app.get(["/uploads/:name", "/api/uploads/:name"], async (req, res) => {
  if (!UPLOAD_NAME.test(req.params.name)) return res.status(404).end();
  const file = await store.getUpload(req.params.name);
  if (!file) return res.status(404).end();
  res.set("Content-Type", file.mime);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(file.data);
});

// Public
app.get("/api/site", async (_req, res) => {
  const { settings, team } = await store.get("settings", "team");
  res.json({ settings, team });
});
for (const kind of ["properties", "vehicles"]) {
  app.get(`/api/${kind}`, async (_req, res) => {
    const { [kind]: list } = await store.get(kind);
    res.json(list.filter((x) => !x.hidden));
  });
}
app.post("/api/enquiries", async (req, res) => {
  const { name, phone, email, interest, message, website } = req.body || {};
  if (website) return res.json({ ok: true }); // spam honeypot
  if (!String(name || "").trim() || !String(phone || "").trim()) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const clip = (v, n) => String(v || "").trim().slice(0, n);
  await store.prepend("enquiries", {
    id: crypto.randomUUID(),
    name: clip(name, 100), phone: clip(phone, 30), email: clip(email, 120),
    interest: clip(interest, 60), message: clip(message, 3000),
    createdAt: new Date().toISOString(), read: false,
  });
  res.json({ ok: true });
});

// Admin: login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!safeEqual(username, ADMIN_USER) || !safeEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Wrong username or password." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  await store.createSession(token, new Date(Date.now() + SESSION_MS));
  res.json({ token });
});
app.post("/api/admin/logout", async (req, res) => {
  const token = bearer(req);
  if (token) await store.deleteSession(token);
  res.json({ ok: true });
});

const admin = express.Router();
admin.use(requireAdmin);

admin.get("/summary", async (_req, res) => {
  const { properties, vehicles, enquiries } = await store.get("properties", "vehicles", "enquiries");
  res.json({
    properties: properties.length,
    vehicles: vehicles.length,
    enquiries: enquiries.length,
    unread: enquiries.filter((e) => !e.read).length,
    latest: enquiries.slice(0, 5),
  });
});

// Listings CRUD (properties & vehicles)
for (const kind of ["properties", "vehicles"]) {
  admin.get(`/${kind}`, async (_req, res) => res.json((await store.get(kind))[kind]));
  admin.post(`/${kind}`, async (req, res) => {
    const item = cleanListing(kind, req.body || {});
    if (!item.title || item.price === undefined) return res.status(400).json({ error: "Title and price are required." });
    const { [kind]: list } = await store.get(kind);
    item.id = uniqueId(list, item.title);
    list.unshift(item);
    await store.set(kind, list);
    res.status(201).json(item);
  });
  admin.put(`/${kind}/:id`, async (req, res) => {
    const { [kind]: list } = await store.get(kind);
    const i = list.findIndex((x) => x.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found." });
    const item = cleanListing(kind, req.body || {});
    if (!item.title || item.price === undefined) return res.status(400).json({ error: "Title and price are required." });
    list[i] = { ...item, id: req.params.id };
    await store.set(kind, list);
    res.json(list[i]);
  });
  admin.delete(`/${kind}/:id`, async (req, res) => {
    const { [kind]: list } = await store.get(kind);
    await store.set(kind, list.filter((x) => x.id !== req.params.id));
    res.json({ ok: true });
  });
}

// Enquiries
admin.get("/enquiries", async (_req, res) => res.json((await store.get("enquiries")).enquiries));
admin.patch("/enquiries/:id", async (req, res) => {
  const { enquiries } = await store.get("enquiries");
  const e = enquiries.find((x) => x.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Not found." });
  e.read = Boolean(req.body?.read);
  await store.set("enquiries", enquiries);
  res.json(e);
});
admin.delete("/enquiries/:id", async (req, res) => {
  const { enquiries } = await store.get("enquiries");
  await store.set("enquiries", enquiries.filter((x) => x.id !== req.params.id));
  res.json({ ok: true });
});

// Team / directors
admin.put("/team/:id", async (req, res) => {
  const { team } = await store.get("team");
  const m = team.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Not found." });
  for (const k of ["name", "role", "bio", "photo"]) if (typeof req.body?.[k] === "string") m[k] = req.body[k].trim();
  await store.set("team", team);
  res.json(m);
});

// Settings
admin.put("/settings", async (req, res) => {
  const { settings } = await store.get("settings");
  for (const k of Object.keys(seed.settings)) if (typeof req.body?.[k] === "string") settings[k] = req.body[k].trim();
  await store.set("settings", settings);
  res.json(settings);
});

// Image upload
const EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD },
  fileFilter: (_req, file, cb) => cb(null, Boolean(EXT[file.mimetype])),
});
admin.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Please choose a JPG, PNG or WEBP image under 4 MB." });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${EXT[req.file.mimetype]}`;
  await store.saveUpload(name, req.file.mimetype, req.file.buffer);
  res.json({ url: `/uploads/${name}` });
});

app.use("/api/admin", admin);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

export function handleErrors(appToWrap) {
  appToWrap.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.code === "LIMIT_FILE_SIZE" ? "Image is too large (max 4 MB)." : "Server error." });
  });
}
