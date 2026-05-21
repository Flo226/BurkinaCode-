import { useState, useEffect } from "react";

// ── Dynamic imports Permis B (44 séries) ──────────────────────────────────────
const loadersB = {
  1:()=>import("./series/sB01.js"), 2:()=>import("./series/sB02.js"),
  3:()=>import("./series/sB03.js"), 4:()=>import("./series/sB04.js"),
  5:()=>import("./series/sB05.js"), 6:()=>import("./series/sB06.js"),
  7:()=>import("./series/sB07.js"), 8:()=>import("./series/sB08.js"),
  9:()=>import("./series/sB09.js"), 10:()=>import("./series/sB10.js"),
  11:()=>import("./series/sB11.js"),12:()=>import("./series/sB12.js"),
  13:()=>import("./series/sB13.js"),14:()=>import("./series/sB14.js"),
  15:()=>import("./series/sB15.js"),16:()=>import("./series/sB16.js"),
  17:()=>import("./series/sB17.js"),18:()=>import("./series/sB18.js"),
  19:()=>import("./series/sB19.js"),20:()=>import("./series/sB20.js"),
  21:()=>import("./series/sB21.js"),22:()=>import("./series/sB22.js"),
  23:()=>import("./series/sB23.js"),24:()=>import("./series/sB24.js"),
  25:()=>import("./series/sB25.js"),26:()=>import("./series/sB26.js"),
  27:()=>import("./series/sB27.js"),28:()=>import("./series/sB28.js"),
  29:()=>import("./series/sB29.js"),30:()=>import("./series/sB30.js"),
  31:()=>import("./series/sB31.js"),32:()=>import("./series/sB32.js"),
  33:()=>import("./series/sB33.js"),34:()=>import("./series/sB34.js"),
  35:()=>import("./series/sB35.js"),36:()=>import("./series/sB36.js"),
  37:()=>import("./series/sB37.js"),38:()=>import("./series/sB38.js"),
  39:()=>import("./series/sB39.js"),40:()=>import("./series/sB40.js"),
  41:()=>import("./series/sB41.js"),42:()=>import("./series/sB42.js"),
  43:()=>import("./series/sB43.js"),44:()=>import("./series/sB44.js"),
};

// ── Dynamic imports Permis C (32 séries) ──────────────────────────────────────
const loadersC = {
  1:()=>import("./series/sC01.js"), 2:()=>import("./series/sC02.js"),
  3:()=>import("./series/sC03.js"), 4:()=>import("./series/sC04.js"),
  5:()=>import("./series/sC05.js"), 6:()=>import("./series/sC06.js"),
  7:()=>import("./series/sC07.js"), 8:()=>import("./series/sC08.js"),
  9:()=>import("./series/sC09.js"), 10:()=>import("./series/sC10.js"),
  11:()=>import("./series/sC11.js"),12:()=>import("./series/sC12.js"),
  13:()=>import("./series/sC13.js"),14:()=>import("./series/sC14.js"),
  15:()=>import("./series/sC15.js"),16:()=>import("./series/sC16.js"),
  17:()=>import("./series/sC17.js"),18:()=>import("./series/sC18.js"),
  19:()=>import("./series/sC19.js"),20:()=>import("./series/sC20.js"),
  21:()=>import("./series/sC21.js"),22:()=>import("./series/sC22.js"),
  23:()=>import("./series/sC23.js"),24:()=>import("./series/sC24.js"),
  25:()=>import("./series/sC25.js"),26:()=>import("./series/sC26.js"),
  27:()=>import("./series/sC27.js"),28:()=>import("./series/sC28.js"),
  29:()=>import("./series/sC29.js"),30:()=>import("./series/sC30.js"),
  31:()=>import("./series/sC31.js"),32:()=>import("./series/sC32.js"),
};

const TOTAL_SERIES = { B: 44, C: 32 };
const TOTAL_Q      = { B: 1320, C: 960 };

// 🇧🇫 Couleurs drapeau Burkina Faso : Rouge #EF2B2D, Vert #009A44, Jaune/Or #FCD116
const BF = {
  rouge:  "#EF2B2D",
  vert:   "#009A44",
  or:     "#FCD116",
  rougeDark: "#B71C1C",
  vertDark:  "#005C29",
  orDark:    "#F9A825",
};

const COLORS = {
  A: { bg:"#FFF3E0", border:"#FCD116", text:"#7B5800" },
  B: { bg:"#E8F5E9", border:"#009A44", text:"#005C29" },
  C: { bg:"#FFEBEE", border:"#EF2B2D", text:"#B71C1C" },
  D: { bg:"#FFF8E1", border:"#FF8F00", text:"#E65100" },
};

const THEMES = {
  B: { grad1:"#8B0000", grad2:"#EF2B2D", accent:"#FCD116", accentDark:"#F9A825", emoji:"🚗", label:"PERMIS B", sub:"Voiture légère" },
  C: { grad1:"#005C29", grad2:"#009A44", accent:"#FCD116", accentDark:"#F9A825", emoji:"🚛", label:"PERMIS C", sub:"Poids lourd" },
};

// Shuffle array
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── FREEMIUM SYSTEM SÉCURISÉ ────────────────────────────────────────────────
const FREE_LIMIT = 5; // Séries 1-5 gratuites

// Génère une empreinte unique de l'appareil
async function getDeviceId() {
  try {
    const stored = localStorage.getItem("burkinacode_device_id");
    if (stored) return stored;
    // Générer un ID unique basé sur les caractéristiques de l'appareil
    const raw = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || "",
      navigator.deviceMemory || "",
    ].join("|");
    // Hash simple
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    // Ajouter un UUID aléatoire pour renforcer l'unicité
    const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2,16);
    const deviceId = Math.abs(hash).toString(16) + "-" + uuid;
    localStorage.setItem("burkinacode_device_id", deviceId);
    return deviceId;
  } catch { return "unknown-device"; }
}

// Vérifie le premium via token stocké localement + vérification serveur
function isPremium() {
  try {
    const token = localStorage.getItem("burkinacode_token");
    return !!token;
  } catch { return false; }
}

// Activation sécurisée via API Vercel
async function activatePremium(code) {
  const deviceId = await getDeviceId();
  const cleanCode = code.trim().toUpperCase();
  try {
    const res = await fetch("/api/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode, deviceId }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      // Stocker le token lié à cet appareil
      localStorage.setItem("burkinacode_token", data.token);
      localStorage.setItem("burkinacode_code", cleanCode);
      return { success: true };
    }
    return { success: false, error: data.error || "Code invalide" };
  } catch {
    return { success: false, error: "Erreur réseau. Vérifiez votre connexion." };
  }
}

// Vérification du token au démarrage (optionnel, pour révocation)
async function verifyToken() {
  try {
    const token = localStorage.getItem("burkinacode_token");
    const code  = localStorage.getItem("burkinacode_code");
    if (!token || !code) return false;
    const deviceId = await getDeviceId();
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, deviceId, token }),
    });
    const data = await res.json();
    if (!data.valid) {
      // Token invalide → supprimer
      localStorage.removeItem("burkinacode_token");
      localStorage.removeItem("burkinacode_code");
      return false;
    }
    return true;
  } catch { return isPremium(); } // En cas d'erreur réseau, utiliser le cache local
}

function isSeriesUnlocked(n) {
  return n <= FREE_LIMIT || isPremium();
}


// ─── LOGO BURKINACODE ──────────────────────────────────────────────────────────
function BurkinaLogo({ size = 64 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Fond cercle */}
      <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="#FCD116" strokeWidth="3"/>
      {/* Bandes drapeau BF en arc */}
      <path d="M 50 4 A 46 46 0 0 1 96 50 L 50 50 Z" fill="#EF2B2D"/>
      <path d="M 50 50 L 96 50 A 46 46 0 0 1 4 50 Z" fill="#009A44"/>
      {/* Étoile centrale */}
      <polygon points="50,22 54,36 68,36 57,45 61,59 50,50 39,59 43,45 32,36 46,36"
        fill="#FCD116" opacity="0.95"/>
      {/* Cercle blanc pour texte */}
      <circle cx="50" cy="50" r="22" fill="white" opacity="0.15"/>
      {/* Lettres BC */}
      <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="900"
        fill="white" fontFamily="Arial,sans-serif" letterSpacing="-1">BC</text>
    </svg>
  );
}

// ─── OFFLINE DOWNLOADER ────────────────────────────────────────────────────────
function OfflineDownloader({ onClose }) {
  const TOTAL = 76;
  const [done,    setDone]    = useState(0);
  const [status,  setStatus]  = useState("idle");
  const [current, setCurrent] = useState("");

  const startDownload = async () => {
    setStatus("loading");
    setDone(0);
    let count = 0;
    try {
      for (let i = 1; i <= 44; i++) {
        setCurrent(`Permis B — Série ${i}/44`);
        await loadersB[i]();
        count++; setDone(count);
      }
      for (let i = 1; i <= 32; i++) {
        setCurrent(`Permis C — Série ${i}/32`);
        await loadersC[i]();
        count++; setDone(count);
      }
      setStatus("success"); setCurrent("");
    } catch(e) {
      setStatus("error"); setCurrent("Erreur — vérifie ta connexion");
    }
  };

  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div style={{position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,0.88)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"20px 20px 0",overflowY:"auto"}}>
      <div style={{background:"#1a1a1a",borderRadius:24,padding:28,width:"100%",maxWidth:340,
        border:`2px solid ${BF.or}44`,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",marginBottom:20}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>📥 Mode hors connexion</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",
            color:"#fff",fontSize:16,width:32,height:32,borderRadius:16,cursor:"pointer"}}>✕</button>
        </div>

        {status === "idle" && (<>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.7,marginBottom:16}}>
            Télécharge les <strong style={{color:BF.or}}>76 séries</strong> (Permis B + C)
            pour utiliser l'appli <strong style={{color:BF.or}}>sans connexion internet</strong>.
          </div>
          <div style={{background:`${BF.or}18`,border:`1px solid ${BF.or}44`,
            borderRadius:12,padding:"10px 14px",marginBottom:20,fontSize:12,color:BF.or}}>
            ⚠️ Connecte-toi au <strong>Wi-Fi</strong> — environ <strong>150-200 Mo</strong> seront téléchargés.
          </div>
          <button onClick={startDownload} style={{width:"100%",padding:"15px",borderRadius:14,
            border:"none",cursor:"pointer",fontSize:15,fontWeight:800,color:"#fff",
            background:`linear-gradient(135deg,${BF.vertDark},${BF.vert})`,
            boxShadow:`0 4px 16px ${BF.vert}44`}}>
            🚀 Télécharger toutes les séries
          </button>
        </>)}

        {status === "loading" && (<>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:38,marginBottom:8}}>⏳</div>
            <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Téléchargement en cours…</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{current}</div>
          </div>
          <div style={{height:12,background:"rgba(255,255,255,0.08)",borderRadius:6,overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",borderRadius:6,width:`${pct}%`,
              background:`linear-gradient(90deg,${BF.rouge},${BF.or},${BF.vert})`,
              transition:"width 0.3s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.55)"}}>
            <span>{done} / {TOTAL} séries</span>
            <span style={{color:BF.or,fontWeight:700}}>{pct}%</span>
          </div>
        </>)}

        {status === "success" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:10}}>✅</div>
            <div style={{fontSize:18,fontWeight:900,color:BF.vert,marginBottom:8}}>Téléchargement terminé !</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:20,lineHeight:1.6}}>
              Les <strong style={{color:BF.or}}>76 séries</strong> sont disponibles hors connexion.<br/>Tu peux activer le mode avion 📵
            </div>
            <button onClick={onClose} style={{width:"100%",padding:"14px",borderRadius:14,
              border:"none",cursor:"pointer",fontSize:15,fontWeight:800,color:"#fff",
              background:`linear-gradient(135deg,${BF.vertDark},${BF.vert})`}}>
              🎉 Commencer l'entraînement
            </button>
          </div>
        )}

        {status === "error" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:10}}>❌</div>
            <div style={{fontSize:16,fontWeight:800,color:BF.rouge,marginBottom:8}}>Erreur de connexion</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:20}}>
              Vérifie ta connexion internet et réessaie.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStatus("idle")} style={{flex:1,padding:"12px",borderRadius:14,
                border:"none",cursor:"pointer",fontWeight:700,color:"#fff",
                background:`linear-gradient(135deg,${BF.rougeDark},${BF.rouge})`}}>🔄 Réessayer</button>
              <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:14,cursor:"pointer",
                background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",
                color:"#fff",fontWeight:700}}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ onSelect }) {
  const [showOffline, setShowOffline] = useState(false);
  return (
    <div style={{...S.homeWrap, position:"relative"}}>
      {showOffline && <OfflineDownloader onClose={() => setShowOffline(false)}/>}
      {/* Bandes drapeau BF en fond */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:`linear-gradient(135deg,${BF.rougeDark},${BF.rouge})`,zIndex:0}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:`linear-gradient(135deg,${BF.vertDark},${BF.vert})`,zIndex:0}}/>
      {/* Étoile décorative en fond */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:0,opacity:0.06}}>
        <div style={{fontSize:280,lineHeight:1}}>★</div>
      </div>

      {/* Logo + Titre */}
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 24px 20px"}}>
        <BurkinaLogo size={90}/>
        <div style={{fontSize:28,fontWeight:900,color:"#fff",letterSpacing:2,marginTop:12,
          textTransform:"uppercase",textShadow:"0 2px 8px rgba(0,0,0,0.4)"}}>BurkinaCode</div>
        <div style={{width:60,height:3,background:BF.or,borderRadius:2,margin:"8px 0"}}/>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"center",lineHeight:1.5,
          fontStyle:"italic",maxWidth:280}}>
          Bienvenue à l'entraînement du code de la route
        </div>
      </div>

      {/* Cards permis */}
      <div style={{position:"relative",zIndex:1,padding:"0 18px",flex:1}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",
          textTransform:"uppercase",letterSpacing:2,marginBottom:14,textAlign:"center"}}>
          Choisissez votre permis
        </div>
        {["B","C"].map(cat => {
          const t = THEMES[cat];
          const isB = cat === "B";
          return (
            <button key={cat} onClick={() => onSelect(cat)}
              style={{width:"100%",borderRadius:20,padding:"20px 18px",marginBottom:12,
                background: isB
                  ? `linear-gradient(135deg,${BF.rougeDark},${BF.rouge})`
                  : `linear-gradient(135deg,${BF.vertDark},${BF.vert})`,
                border:`2px solid ${BF.or}55`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"space-between",
                boxShadow:"0 8px 28px rgba(0,0,0,0.35)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:52,height:52,borderRadius:14,flexShrink:0,
                  background:"rgba(252,209,22,0.2)",border:`2px solid ${BF.or}66`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>
                  {t.emoji}
                </div>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:1}}>{t.label}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:2}}>{t.sub}</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <div style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,
                  background:BF.or+"33",color:BF.or}}>
                  {TOTAL_SERIES[cat]} séries
                </div>
                <span style={{fontSize:18,color:BF.or}}>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bouton hors connexion — visible seulement après activation Premium */}
      {isPremium() && (
      <div style={{position:"relative",zIndex:1,padding:"0 18px 12px"}}>
        <button onClick={()=>setShowOffline(true)}
          style={{width:"100%",borderRadius:16,padding:"13px 18px",
            background:"rgba(0,0,0,0.35)",border:`1.5px solid ${BF.or}66`,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            boxShadow:"0 4px 14px rgba(0,0,0,0.25)"}}>
          <span style={{fontSize:20}}>📥</span>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:800,color:BF.or}}>Utiliser hors connexion</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:1}}>Télécharger toutes les séries (Wi-Fi recommandé)</div>
          </div>
        </button>
      </div>
      )}
      </div>
    </div>
  );
}

// ─── SERIES PICKER ─────────────────────────────────────────────────────────────

// ─── ACTIVATION MODAL ─────────────────────────────────────────────────────────
function ActivationModal({ onSuccess, onClose }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleActivate = async () => {
    if (!code.trim()) return;
    setError(""); setLoading(true);
    const result = await activatePremium(code);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } else {
      setError(result.error || "Code invalide. Vérifiez et réessayez.");
    }
  };

  return (
    <div style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"20px 20px 0",overflowY:"auto"}}>
      <div style={{background:"#1a1a1a",borderRadius:24,padding:28,width:"100%",maxWidth:340,
        border:`2px solid ${BF.or}44`,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>🔓 Activation Premium</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",
            color:"#fff",fontSize:16,width:32,height:32,borderRadius:16,cursor:"pointer"}}>✕</button>
        </div>

        {!success ? (<>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,marginBottom:16}}>
            Entrez votre <strong style={{color:BF.or}}>code d'activation</strong> pour débloquer
            toutes les séries Permis B et C.
          </div>
          <div style={{background:`${BF.or}18`,border:`1px solid ${BF.or}44`,borderRadius:12,
            padding:"12px 14px",marginBottom:16,fontSize:12,color:BF.or,lineHeight:1.6}}>
          </div>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key==="Enter" && handleActivate()}
            placeholder="Ex: BKCODE-XXXX-XXXX"
            style={{width:"100%",padding:"14px",borderRadius:12,border:`2px solid ${BF.or}44`,
              background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:14,
              fontWeight:700,letterSpacing:1,boxSizing:"border-box",
              outline:"none",marginBottom:10,textAlign:"center"}}
          />
          {error && (
            <div style={{color:BF.rouge,fontSize:12,fontWeight:600,
              textAlign:"center",marginBottom:10}}>❌ {error}</div>
          )}
          <button onClick={handleActivate} style={{width:"100%",padding:"15px",borderRadius:14,
            border:`3px solid ${BF.or}`,cursor:loading?"not-allowed":"pointer",fontSize:16,fontWeight:900,color:"#fff",opacity:loading?0.7:1,
            background:`linear-gradient(135deg,${BF.rougeDark},${BF.rouge})`,
            boxShadow:`0 6px 20px ${BF.rouge}66`,marginTop:4}}>
            {loading ? "⏳ Vérification..." : "✅ Valider le code"}
          </button>
        </>) : (
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:56,marginBottom:12}}>🎉</div>
            <div style={{fontSize:18,fontWeight:900,color:BF.or,marginBottom:8}}>Accès débloqué !</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>
              Toutes les séries sont maintenant disponibles.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SeriesPicker({ cat, onSelectSeries, onBack }) {
  const t = THEMES[cat];
  const total = TOTAL_SERIES[cat];
  const isB = cat === "B";
  const [premium, setPremium] = useState(isPremium());
  const [showActivation, setShowActivation] = useState(false);

  const handleSeriesClick = (n) => {
    if (isSeriesUnlocked(n)) { onSelectSeries(n); }
    else { setShowActivation(true); }
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F0E8",position:"relative",overflow:"hidden"}}>
      {showActivation && (
        <ActivationModal
          onSuccess={() => { setPremium(true); setShowActivation(false); }}
          onClose={() => setShowActivation(false)}
        />
      )}
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${isB?BF.rougeDark:BF.vertDark},${isB?BF.rouge:BF.vert})`,
        padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:`3px solid ${BF.or}`}}>
        <button style={S.backBtn} onClick={onBack}>← Accueil</button>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#fff",fontSize:16,fontWeight:800}}>{t.emoji} {t.label}</div>
          <div style={{color:BF.or,fontSize:11,marginTop:1}}>
            {premium ? `${total} séries • ${TOTAL_Q[cat]} questions` : `${FREE_LIMIT} gratuites • ${total-FREE_LIMIT} 🔒`}
          </div>
        </div>
      </div>

      {/* Premium banner */}
      {!premium && (
        <div style={{background:`linear-gradient(135deg,#4a3000,#7a5000)`,
          padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",
          borderBottom:`2px solid ${BF.or}44`}}>
          <div>
            <div style={{color:BF.or,fontSize:12,fontWeight:800}}>🔓 Débloquer toutes les séries</div>
          </div>
          <button onClick={() => setShowActivation(true)}
            style={{background:`linear-gradient(135deg,${BF.orDark||"#F9A825"},${BF.or})`,
              color:"#3D2B1A",border:"none",borderRadius:10,
              padding:"8px 14px",fontSize:12,fontWeight:800,cursor:"pointer",
              boxShadow:"0 2px 8px rgba(252,209,22,0.4)"}}>
            Activer
          </button>
        </div>
      )}
      {premium && (
        <div style={{background:`linear-gradient(135deg,${BF.vertDark},#007a35)`,
          padding:"8px 16px",textAlign:"center",borderBottom:`2px solid ${BF.or}44`}}>
          <div style={{color:BF.or,fontSize:11,fontWeight:700}}>✅ Premium actif — Accès illimité à toutes les séries</div>
        </div>
      )}

      {/* Series grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,padding:"14px",overflowY:"scroll",flex:1,minHeight:0}}>
        {Array.from({length:total},(_,i)=>i+1).map(n => {
          const unlocked = n <= FREE_LIMIT || premium;
          return (
            <button key={n} onClick={() => handleSeriesClick(n)}
              style={{background: unlocked?"#fff":"#EDE8E0",borderRadius:14,padding:"14px 6px",
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                border:`2px solid ${unlocked?(isB?BF.rouge+"44":BF.vert+"44"):"#C4B8A8"}`,
                cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                position:"relative",transition:"transform 0.15s"}}>
              {!unlocked && (
                <div style={{position:"absolute",top:-7,right:-7,background:"#7a6248",
                  borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:10,boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}}>🔒</div>
              )}
              {n<=FREE_LIMIT && !premium && (
                <div style={{position:"absolute",top:-7,left:-7,background:BF.vert,
                  borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:9,boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}}>🆓</div>
              )}
              <div style={{fontSize:21,fontWeight:900,color:unlocked?(isB?BF.rouge:BF.vert):"#8B7355"}}>{n}</div>
              <div style={{fontSize:9,color:unlocked?"#94A3B8":"#A89880",fontWeight:700,
                textTransform:"uppercase",letterSpacing:1}}>Série</div>
              <div style={{fontSize:9,fontWeight:700,color:unlocked?BF.or:"#8B7355"}}>
                {unlocked?"30 Q":"🔒"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{background:isB?BF.rougeDark:BF.vertDark,padding:"8px 14px",
        textAlign:"center",borderTop:`2px solid ${BF.or}44`}}>
      </div>
    </div>
  );
}
function LevelPicker({ cat, seriesNum, onSelect, onBack }) {
  const isB = cat === "B";
  const levels = [
    { key:"beginner",     label:"Débutant",      emoji:"🟢", desc:"Aucune limite de temps — apprends à ton rythme", time:null, color:BF.vert },
    { key:"intermediate", label:"Intermédiaire", emoji:"🟡", desc:"30 secondes par question",                        time:30,   color:BF.or   },
    { key:"pro",          label:"Pro",            emoji:"🔴", desc:"20 secondes par question — mode examen",          time:20,   color:BF.rouge},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F0E8"}}>
      <div style={{background:`linear-gradient(135deg,${isB?BF.rougeDark:BF.vertDark},${isB?BF.rouge:BF.vert})`,
        padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:`3px solid ${BF.or}`}}>
        <button style={S.backBtn} onClick={onBack}>← Séries</button>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#fff",fontSize:15,fontWeight:800}}>{isB?"🚗":"🚛"} Série {seriesNum}</div>
          <div style={{color:BF.or,fontSize:11,marginTop:1}}>Choisissez votre niveau</div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"20px 18px",gap:14}}>
        <div style={{textAlign:"center",marginBottom:4}}>
          <div style={{fontSize:38,marginBottom:6}}>🎯</div>
          <div style={{fontSize:19,fontWeight:900,color:"#1a1a1a"}}>Niveau de difficulté</div>
          <div style={{fontSize:12,color:"#64748B",marginTop:4}}>Le minuteur se réinitialise à chaque question</div>
        </div>
        {levels.map(lv => (
          <button key={lv.key} onClick={() => onSelect(lv)}
            style={{background:"#fff",borderRadius:18,padding:"18px 16px",
              border:`2px solid ${lv.color}44`,cursor:"pointer",
              display:"flex",alignItems:"center",gap:14,
              boxShadow:"0 4px 14px rgba(0,0,0,0.08)",textAlign:"left"}}>
            <div style={{width:50,height:50,borderRadius:14,flexShrink:0,
              background:`${lv.color}22`,border:`2px solid ${lv.color}55`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
              {lv.emoji}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:"#1a1a1a"}}>{lv.label}</div>
              <div style={{fontSize:12,color:"#64748B",marginTop:2}}>{lv.desc}</div>
            </div>
            <span style={{fontSize:18,color:"#CBD5E1"}}>→</span>
          </button>
        ))}
      </div>
      <div style={{background:isB?BF.rougeDark:BF.vertDark,padding:"8px 14px",
        textAlign:"center",borderTop:`2px solid ${BF.or}44`}}>
      </div>
    </div>
  );
}

// ─── TIMER BAR ─────────────────────────────────────────────────────────────────
function TimerBar({ timeLimit, running, onExpire }) {
  const [pct, setPct] = useState(100);
  useEffect(() => {
    if (!running) return;
    setPct(100);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const rem = Math.max(0, timeLimit - elapsed);
      setPct((rem / timeLimit) * 100);
      if (rem <= 0) { clearInterval(id); onExpire(); }
    }, 80);
    return () => clearInterval(id);
  }, [running]);
  const col = pct > 50 ? BF.vert : pct > 25 ? BF.or : BF.rouge;
  const sec = Math.ceil((pct / 100) * timeLimit);
  return (
    <div style={{height:8,background:"#E2D9C8",flexShrink:0,position:"relative",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:col,transition:"width 0.08s linear"}}/>
      {running && (
        <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
          fontSize:10,fontWeight:900,color:col}}>{sec}s</div>
      )}
    </div>
  );
}

// ─── QUIZ SCREEN ───────────────────────────────────────────────────────────────
function QuizScreen({ cat, seriesNum, level, onBack }) {
  const isB     = cat === "B";
  const timeLimit = level.time;

  const [questions,  setQuestions]  = useState(null);
  const [current,    setCurrent]    = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timerKey,   setTimerKey]   = useState(0);

  useEffect(() => {
    setQuestions(null); setCurrent(0); setAnswers({});
    setSubmitted(false); setShowResult(false); setTimerKey(0);
    const loaders = cat === "B" ? loadersB : loadersC;
    loaders[seriesNum]().then(m => setQuestions(shuffle(m.default)));
  }, [cat, seriesNum]);

  if (!questions) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:"#F5F0E8",gap:12}}>
      <BurkinaLogo size={60}/>
      <div style={{fontSize:14,color:"#64748B",fontWeight:600}}>Chargement série {seriesNum}…</div>
    </div>
  );

  const q       = questions[current];
  const totalQ  = questions.length;
  const sel     = answers[q.id] || [];
  const expired = submitted && sel.length === 0;

  const handleExpire = () => setSubmitted(true);
  const toggle = (label) => {
    if (submitted) return;
    const prev = answers[q.id] || [];
    const next = q.multiple
      ? prev.includes(label) ? prev.filter(l=>l!==label) : [...prev,label]
      : prev.includes(label) ? [] : [label];
    setAnswers({...answers,[q.id]:next});
  };
  const validate = () => { if (sel.length > 0) setSubmitted(true); };
  const goNext = () => {
    if (current < totalQ-1) { setCurrent(c=>c+1); setSubmitted(false); setTimerKey(k=>k+1); }
    else setShowResult(true);
  };
  const restart = () => {
    setCurrent(0); setAnswers({}); setSubmitted(false);
    setShowResult(false); setTimerKey(k=>k+1);
    const loaders2 = cat === "B" ? loadersB : loadersC;
    loaders2[seriesNum]().then(m => setQuestions(shuffle(m.default)));
  };
  const isCorrect = (l) => q.correct.includes(l);
  const isOk = () => sel.length===q.correct.length && sel.every(l=>q.correct.includes(l));
  const score = questions.reduce((acc,q) => {
    const s=answers[q.id]||[];
    return acc+(s.length===q.correct.length&&s.every(l=>q.correct.includes(l))?1:0);
  },0);

  const mainColor = isB ? BF.rouge : BF.vert;
  const darkColor = isB ? BF.rougeDark : BF.vertDark;

  // ── Results ──
  if (showResult) {
    const pct=Math.round(score/totalQ*100), passed=pct>=70;
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F0E8"}}>
        <div style={{background:`linear-gradient(135deg,${darkColor},${mainColor})`,
          padding:"14px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",
          borderBottom:`3px solid ${BF.or}`}}>
          <button style={S.backBtn} onClick={onBack}>← Séries</button>
          <span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20,
            color:BF.or,background:BF.or+"22"}}>Résultats</span>
        </div>
        <div style={{flex:1,overflowY:"scroll",padding:"16px",WebkitOverflowScrolling:"touch"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:52}}>{passed?"🏆":"📚"}</div>
            <div style={{fontSize:24,fontWeight:900,color:"#1a1a1a"}}>{passed?"Bravo !":"Continue !"}</div>
            <div style={{fontSize:46,fontWeight:900,color:mainColor,lineHeight:1.1}}>{score}/{totalQ}</div>
            <div style={{color:"#718096",fontSize:12,marginTop:4}}>
              {pct}% — {isB?"Permis B":"Permis C"} S{seriesNum} — {level.emoji} {level.label}
            </div>
            <div style={{height:10,background:"#E2D9C8",borderRadius:5,margin:"10px 0",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,borderRadius:5,
                background:passed?`linear-gradient(90deg,${BF.vert},#2ecc71)`:`linear-gradient(90deg,${BF.rouge},#ff6b6b)`}}/>
            </div>
          </div>
          {questions.map((q,i) => {
            const s=answers[q.id]||[], ok=s.length===q.correct.length&&s.every(l=>q.correct.includes(l));
            return (
              <div key={q.id} style={{display:"flex",alignItems:"center",gap:8,
                padding:"8px 12px",borderRadius:10,marginBottom:5,
                background:ok?"#E8F5E9":"#FFEBEE"}}>
                <span style={{fontSize:14}}>{ok?"✅":"❌"}</span>
                <span style={{fontSize:11,fontWeight:600,color:ok?"#2e7d32":"#c62828"}}>
                  Q{i+1} — {q.correct.join(", ")}
                  {!ok&&s.length>0&&` (ta réponse : ${s.join(", ")})`}
                  {!ok&&s.length===0&&" ⏰ temps écoulé"}
                </span>
              </div>
            );
          })}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button style={{...S.btnPrimary,flex:1,background:`linear-gradient(135deg,${darkColor},${mainColor})`}} onClick={restart}>🔄 Recommencer</button>
            <button style={{...S.btnGold,flex:1}} onClick={onBack}>📋 Séries</button>
          </div>
        </div>
        <div style={{background:darkColor,padding:"8px 14px",textAlign:"center",
          borderTop:`2px solid ${BF.or}44`}}>
        </div>
      </div>
    );
  }

  // ── Question ──
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F0E8"}}>
      <div style={{background:`linear-gradient(135deg,${darkColor},${mainColor})`,
        padding:"14px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:`3px solid ${BF.or}`}}>
        <button style={S.backBtn} onClick={onBack}>← Séries</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:BF.or,fontWeight:700,
            background:BF.or+"22",padding:"3px 8px",borderRadius:10}}>
            {level.emoji} {level.label}
          </span>
          <span style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:20,
            color:BF.or,background:BF.or+"22"}}>{current+1}/{totalQ}</span>
        </div>
      </div>

      {/* Barre progression */}
      <div style={{height:4,background:"#E2D9C8",flexShrink:0}}>
        <div style={{height:"100%",width:`${(current/totalQ)*100}%`,
          background:`linear-gradient(90deg,${BF.or},${mainColor})`,transition:"width 0.4s"}}/>
      </div>

      {/* Timer */}
      {timeLimit && (
        <TimerBar key={timerKey} timeLimit={timeLimit} running={!submitted} onExpire={handleExpire}/>
      )}

      {/* Label série */}
      <div style={{textAlign:"center",padding:"5px 0 0",fontSize:10,fontWeight:700,
        color:"#94A3B8",letterSpacing:1}}>
        {isB?"🚗 PERMIS B":"🚛 PERMIS C"} — SÉRIE {seriesNum}
      </div>

      {/* Image */}
      <div style={{padding:"6px 14px 0",flex:1,overflowY:"scroll",display:"flex",flexDirection:"column",WebkitOverflowScrolling:"touch"}}>
        {q.multiple&&<div style={{fontSize:11,color:BF.orDark,fontWeight:700,marginBottom:3,textAlign:"center"}}>⚡ Plusieurs réponses possibles</div>}
        <div style={{borderRadius:14,overflow:"hidden",
          boxShadow:`0 4px 14px rgba(0,0,0,0.15),0 0 0 2px ${BF.or}44`}}>
          <img src={q.img} alt={`Q${q.id}`} style={{width:"100%",display:"block"}}/>
        </div>

        {/* Options */}
        <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:8}}>
          {["A","B","C","D"].map(label => {
            const isSel  = sel.includes(label);
            const status = submitted?(isCorrect(label)?"correct":isSel?"wrong":"idle"):"idle";
            const c      = COLORS[label];
            const bg     = status==="correct"?"#E8F5E9":status==="wrong"?"#FFEBEE":isSel?c.bg:"#fff";
            const brd    = status==="correct"?BF.vert:status==="wrong"?BF.rouge:isSel?c.border:"#DDD0BB";
            const lbg    = status==="correct"?BF.vert:status==="wrong"?BF.rouge:isSel?c.border:"#DDD0BB";
            const lc     = (isSel||status!=="idle")?"#fff":"#9AA5B4";
            const ic     = status==="correct"?"✓":status==="wrong"?"✗":label;
            return (
              <button key={label} onClick={()=>toggle(label)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                  borderRadius:14,border:`2px solid ${brd}`,background:bg,
                  boxShadow:(isSel||status!=="idle")?`0 0 0 2px ${brd}44`:"none",
                  cursor:submitted?"default":"pointer",transition:"all 0.18s",textAlign:"left",
                  opacity:submitted&&status==="idle"?0.45:1}}>
                <div style={{width:34,height:34,borderRadius:10,background:lbg,color:lc,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:14,fontWeight:800,flexShrink:0}}>{ic}</div>
                <span style={{fontSize:15,fontWeight:700,
                  color:status==="correct"?BF.vertDark:status==="wrong"?BF.rougeDark:isSel?c.text:"#3D2B1A"}}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {submitted&&(
          <div style={{marginTop:8,padding:"10px 14px",borderRadius:12,
            border:`2px solid ${isOk()?BF.vert:BF.rouge}`,
            background:isOk()?"#E8F5E9":"#FFEBEE",
            fontSize:13,fontWeight:700,textAlign:"center",
            color:isOk()?BF.vertDark:BF.rougeDark}}>
            {expired?`⏰ Temps écoulé ! Réponse : ${q.correct.join(", ")}`:
             isOk()?"✅ Bonne réponse !":
             `❌ La bonne réponse était : ${q.correct.join(", ")}`}
          </div>
        )}

        {/* Bouton */}
        <div style={{paddingTop:8,paddingBottom:12}}>
          {!submitted
            ?<button style={{...S.btnPrimary,background:`linear-gradient(135deg,${darkColor},${mainColor})`,
                opacity:sel.length===0?0.4:1}}
                onClick={validate} disabled={sel.length===0}>Valider</button>
            :<button style={S.btnGold} onClick={goNext}>
                {current<totalQ-1?"Question suivante →":"Voir les résultats 🏁"}
              </button>
          }
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,    setScreen]    = useState("home");
  const [cat,       setCat]       = useState(null);
  const [seriesNum, setSeriesNum] = useState(null);
  const [level,     setLevel]     = useState(null);
  return (
    <div style={{minHeight:"100vh",
      background:`linear-gradient(160deg,${BF.rougeDark},#2a0000 40%,${BF.vertDark})`,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 0"}}>
      <div style={{width:390,height:780,borderRadius:40,overflow:"hidden",
        boxShadow:`0 30px 80px rgba(0,0,0,0.65),0 0 0 6px ${BF.or},0 0 0 8px #111`,
        display:"flex",flexDirection:"column",
        background:screen==="home"?"transparent":"#F5F0E8",
        fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        {screen==="home"   && <HomeScreen onSelect={c=>{setCat(c);setScreen("series");}}/>}
        {screen==="series" && <SeriesPicker cat={cat} onSelectSeries={n=>{setSeriesNum(n);setScreen("level");}} onBack={()=>setScreen("home")}/>}
        {screen==="level"  && <LevelPicker cat={cat} seriesNum={seriesNum} onSelect={lv=>{setLevel(lv);setScreen("quiz");}} onBack={()=>setScreen("series")}/>}
        {screen==="quiz"   && <QuizScreen cat={cat} seriesNum={seriesNum} level={level} onBack={()=>setScreen("series")}/>}
      </div>
    </div>
  );
}

const S = {
  homeWrap:  {minHeight:"100%",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",fontFamily:"'Segoe UI',system-ui,sans-serif"},
  backBtn:   {background:"rgba(255,255,255,0.15)",border:`1px solid ${BF.or}55`,color:"#fff",fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:20,cursor:"pointer"},
  btnPrimary:{width:"100%",padding:"14px",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"},
  btnGold:   {width:"100%",padding:"14px",background:`linear-gradient(135deg,${BF.orDark},${BF.or})`,color:"#3D2B1A",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"},
};
