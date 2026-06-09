import { useState, useEffect, useCallback } from "react";

const THEME_GRAD = {
  action:     "linear-gradient(135deg,#fbcfe8,#e0e7ff)",
  resilience: "linear-gradient(135deg,#fef9c3,#fbcfe8)",
  dreams:     "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
  courage:    "linear-gradient(135deg,#fbcfe8,#fed7aa)",
  joy:        "linear-gradient(135deg,#fed7aa,#bbf7d0)",
  growth:     "linear-gradient(135deg,#bbf7d0,#e0e7ff)",
  peace:      "linear-gradient(135deg,#bae6fd,#e0e7ff)",
};

const THEME_EMOJI = {
  action: "⚡", resilience: "💪", dreams: "🌙",
  courage: "🦁", joy: "☀️", growth: "🌱", peace: "🕊️",
};

const FALLBACKS = [
  { quote:"The secret of getting ahead is getting started.", author:"Mark Twain", theme:"action" },
  { quote:"In the middle of every difficulty lies opportunity.", author:"Albert Einstein", theme:"resilience" },
  { quote:"You are never too old to dream a new dream.", author:"C.S. Lewis", theme:"dreams" },
  { quote:"Believe you can and you're halfway there.", author:"Theodore Roosevelt", theme:"courage" },
  { quote:"Happiness comes from your own actions.", author:"Dalai Lama", theme:"joy" },
  { quote:"What you get by achieving your goals is not as important as what you become.", author:"Zig Ziglar", theme:"growth" },
  { quote:"Peace begins with a smile.", author:"Mother Teresa", theme:"peace" },
];

function detectTheme(content, tags = []) {
  const c = content.toLowerCase();
  if (c.includes("courage") || c.includes("brave") || tags.includes("courage")) return "courage";
  if (c.includes("dream") || c.includes("vision") || tags.includes("dreams")) return "dreams";
  if (c.includes("growth") || c.includes("learn") || c.includes("grow") || tags.includes("growth")) return "growth";
  if (c.includes("action") || c.includes("start") || tags.includes("action")) return "action";
  if (c.includes("peace") || c.includes("calm") || tags.includes("peace")) return "peace";
  if (c.includes("resilience") || c.includes("strength") || tags.includes("resilience")) return "resilience";
  return "joy";
}

export default function QuotePanel() {
  const [quote,   setQuote]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetch("https://api.quotable.io/random?tags=inspirational|motivational|wisdom");
      const data = await res.json();
      setQuote({ quote: data.content, author: data.author, theme: detectTheme(data.content, data.tags) });
    } catch {
      setQuote(FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]);
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchQuote(); }, [fetchQuote]);

  const bg = THEME_GRAD[quote?.theme] ?? THEME_GRAD.joy;
  const em = THEME_EMOJI[quote?.theme] ?? "✨";

  return (
    <div style={{
      borderRadius: 28, overflow: "hidden", position: "relative",
      background: bg,
      border: "2px solid rgba(196,181,253,0.6)",
      boxShadow: "0 8px 32px rgba(124,58,237,0.15), 4px 4px 0 rgba(196,181,253,0.3), 6px 6px 0 rgba(249,168,212,0.2), 0 0 0 1px rgba(255,255,255,0.5) inset",
      padding: "20px 20px 16px",
      display: "flex", flexDirection: "column", minHeight: 200,
    }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 15%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 40% 80%, rgba(255,215,0,0.2) 0%, transparent 25%)",
        zIndex:1 }} />

      <div style={{ position:"absolute", top:-14, right:-14, fontSize:64, opacity:0.15, transform:"rotate(20deg)", pointerEvents:"none", filter:"drop-shadow(0 0 8px gold)", zIndex:0 }}>{em}</div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20, filter:"drop-shadow(0 0 4px rgba(255,215,0,0.5))" }}>{em}</span>
          <h3 style={{ fontFamily:"'Pacifico',cursive", fontSize:14, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>Daily Quote</h3>
        </div>
        <button className="tap-btn" onClick={fetchQuote} style={{ width:34, height:34, borderRadius:11, background:"rgba(255,255,255,0.9)", border:"2px solid rgba(124,58,237,0.4)", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", color:"#7c3aed", boxShadow:"0 4px 8px rgba(124,58,237,0.2)", WebkitTapHighlightColor:"transparent" }}>
          {loading ? "⏳" : "↻"}
        </button>
      </div>

      {loading ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, position:"relative", zIndex:2 }}>
          <div style={{ fontSize:26, animation:"floatBob 1.2s ease-in-out infinite", filter:"drop-shadow(0 0 8px pink)" }}>🌸</div>
          <p style={{ fontFamily:"'Caveat',cursive", fontSize:14, color:"#a78bfa", fontWeight:600 }}>Fetching quote...</p>
        </div>
      ) : (
        <div style={{ flex:1, position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:48, color:"rgba(167,139,250,0.3)", lineHeight:0.6, marginBottom:4 }}>"</div>
          <p style={{ fontFamily:"'Caveat',cursive", fontSize:17, fontWeight:600, color:"#1e293b", lineHeight:1.55, fontStyle:"italic", textShadow:"0 1px 2px rgba(255,255,255,0.8)" }}>{quote?.quote}</p>
          <div style={{ fontFamily:"Georgia,serif", fontSize:48, color:"rgba(167,139,250,0.3)", lineHeight:0.4, textAlign:"right" }}>"</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:24, height:2, background:"linear-gradient(90deg,#f9a8d4,#c4b5fd)", borderRadius:2 }}/>
              <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, color:"#7c3aed" }}>{quote?.author}</span>
            </div>
            {quote?.theme && (
              <span style={{ fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:8, background:"rgba(255,255,255,0.8)", color:"#7c3aed", border:"1px solid rgba(196,181,253,0.5)", textTransform:"uppercase", letterSpacing:0.5 }}>
                {quote.theme}
              </span>
            )}
          </div>
          {error && <p style={{ fontSize:9, color:"#94a3b8", marginTop:6, textAlign:"center", fontStyle:"italic" }}>(offline — curated quote)</p>}
        </div>
      )}
    </div>
  );
}
