// Vercel function: serves /api/* and uploaded photos (vercel.json rewrites those paths here).
import { app, handleErrors } from "../server/app.js";

handleErrors(app);

export default app;
