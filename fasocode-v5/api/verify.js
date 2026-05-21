// ─── API Vérification Token — Upstash Redis ────────────────────────────────────
const { Redis } = require("@upstash/redis");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, deviceId, token } = req.body || {};
  if (!code || !deviceId || !token) return res.status(400).json({ valid: false });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const storedDevice = await redis.get(`code:${code.trim().toUpperCase()}`);
  if (storedDevice !== deviceId) return res.status(200).json({ valid: false });

  const crypto = require("crypto");
  const secret = process.env.ACTIVATION_SECRET || "burkinacode-secret-2024";
  const expected = crypto.createHmac("sha256", secret)
    .update(`${code.trim().toUpperCase()}:${deviceId}`).digest("hex");

  return res.status(200).json({ valid: token === expected });
};
