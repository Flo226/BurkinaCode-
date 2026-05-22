// ─── API Activation — Upstash Redis ───────────────────────────────────────────
const { Redis } = require("@upstash/redis");

const VALID_CODES = new Set([
  "BKCODE-6022-TRXC","BKCODE-4025-AFQO","BKCODE-2580-USIE","BKCODE-9300-WPUS",
  "BKCODE-5935-VQWP","BKCODE-7289-KFNM","BKCODE-1847-DLYX","BKCODE-3614-ZHBW",
  "BKCODE-8053-GJRT","BKCODE-6791-OCPE","BKCODE-2438-SNVQ","BKCODE-5167-UAMK",
  "BKCODE-9824-FWTD","BKCODE-4302-IHXL","BKCODE-7615-BJZE","BKCODE-1093-GYPN",
  "BKCODE-8746-RQCV","BKCODE-3259-MLHC","BKCODE-6481-DKFW","BKCODE-0927-TXBS",
  "BKCODE-5374-QNZJ","BKCODE-8610-VEYA","BKCODE-2195-LPWG","BKCODE-7043-HCRU",
  "BKCODE-4568-ZBMD","BKCODE-9182-OQXT","BKCODE-3756-KAFJ","BKCODE-6029-YNSE",
  "BKCODE-1847-WPCV","BKCODE-5293-GRTL","BKCODE-8064-BZHQ","BKCODE-4731-XMNE",
  "BKCODE-2986-OJWF","BKCODE-7453-DKUY","BKCODE-0218-TVZC","BKCODE-5679-RLBP",
  "BKCODE-9341-QHMA","BKCODE-6807-NWJE","BKCODE-3124-FXGV","BKCODE-8590-IZKT",
  "BKCODE-1463-SDOP","BKCODE-7928-YCBU","BKCODE-4285-HVWL","BKCODE-0741-GNJR",
  "BKCODE-5016-MFQZ","BKCODE-8372-BTXE","BKCODE-2649-UKHS","BKCODE-7365-KOGS",
  "BKCODE-0957-TRJB","BKCODE-3502-LPRM",
]);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, deviceId } = req.body || {};
  if (!code || !deviceId)
    return res.status(400).json({ success: false, error: "Données manquantes" });

  const cleanCode = code.trim().toUpperCase();

  // 1. Code valide ?
  if (!VALID_CODES.has(cleanCode))
    return res.status(200).json({ success: false, error: "Code invalide. Vérifiez et réessayez." });

  // 2. Connexion Upstash Redis
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // 3. Code déjà utilisé ?
  const existingDevice = await redis.get(`code:${cleanCode}`);

  if (existingDevice) {
    if (existingDevice === deviceId) {
      const token = generateToken(cleanCode, deviceId);
      return res.status(200).json({ success: true, token, message: "Réactivation réussie !" });
    }
    return res.status(200).json({
      success: false,
      error: "Ce code est déjà activé sur un autre appareil.\nContactez-nous au 54-15-09-75 pour un nouveau code.",
    });
  }

  // 4. Lier le code à cet appareil
  await redis.set(`code:${cleanCode}`, deviceId);

  // 5. Token signé
  const token = generateToken(cleanCode, deviceId);
  return res.status(200).json({ success: true, token, message: "Activation réussie !" });
};

function generateToken(code, deviceId) {
  const crypto = require("crypto");
  const secret = process.env.ACTIVATION_SECRET || "burkinacode-secret-2024";
  return crypto.createHmac("sha256", secret).update(`${code}:${deviceId}`).digest("hex");
}
