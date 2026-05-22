// ─── API Admin — Upstash Redis ─────────────────────────────────────────────────
const { Redis } = require("@upstash/redis");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).end();

  const { adminKey, code, action } = req.body || {};
  const ADMIN_KEY = process.env.ADMIN_KEY || "admin-burkina-2024";
  if (adminKey !== ADMIN_KEY) return res.status(403).json({ error: "Non autorisé" });

  const cleanCode = code?.trim().toUpperCase();
  if (!cleanCode) return res.status(400).json({ error: "Code requis" });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (action === "reset") {
    await redis.del(`code:${cleanCode}`);
    return res.status(200).json({ success: true, message: `Code ${cleanCode} réinitialisé` });
  }
  if (action === "check") {
    const device = await redis.get(`code:${cleanCode}`);
    return res.status(200).json({ code: cleanCode, status: device ? "activé" : "disponible", device });
  }
  return res.status(400).json({ error: "Action inconnue (reset | check)" });
};
