import { CATEGORIES, glass, catFor } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";

// Desktop-only nav tabs (mobile uses BottomNav)
const VIEWS = [
  { id:"split",    label:"Split",    emoji:"⊞" },
  { id:"calendar", label:"Calendar", emoji:"📅" },
  { id:"weekly",   label:"Weekly",   emoji:"🗓" },
  { id:"daily",    label:"Daily",    emoji:"📋" },
];

export default function Header({ activeView, setActiveView, filterCat, setFilterCat, stickerPanel, setStickerPanel, selectedDate }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        {/* Mobile header: logo row + filter chips row */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1.5px solid rgba(196,181,253,0.4)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          boxShadow: "0 2px 16px rgba(124,58,237,0.1)",
        }}>
          {/* Logo row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px 6px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20, filter:"drop-shadow(0 0 6px #ec4899)" }}>🌸</span>
              <h1 style={{ fontFamily:"'Pacifico',cursive", fontSize:16, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                JingJong's Planner
              </h1>
            </div>
            <button
              className="tap-btn"
              onClick={() => setStickerPanel(p => !p)}
              style={{ padding:"7px 12px", borderRadius:14, border:`1.5px solid rgba(124,58,237,${stickerPanel?"0.7":"0.3"})`, background:stickerPanel?"linear-gradient(135deg,#ec4899,#8b5cf6)":"rgba(237,233,254,0.7)", cursor:"pointer", fontSize:13, fontWeight:700, color:stickerPanel?"#fff":"#7c3aed", touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}
            >
              🐰
            </button>
          </div>

          {/* Filter chips row — horizontal scroll */}
          <div style={{ display:"flex", gap:6, padding:"0 14px 10px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <button
              className="tap-btn"
              onClick={() => setFilterCat(null)}
              style={{ padding:"5px 12px", borderRadius:20, border:`1.5px solid ${filterCat===null?"#8b5cf6":"rgba(196,181,253,0.5)"}`, background:filterCat===null?"linear-gradient(135deg,#ec4899,#8b5cf6)":"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:12, fontWeight:800, color:filterCat===null?"#fff":"#6b7280", flexShrink:0, touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}
            >
              ✦ All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className="tap-btn"
                onClick={() => setFilterCat(filterCat===c.id ? null : c.id)}
                style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${filterCat===c.id?c.color:c.color+"40"}`, background:filterCat===c.id?`linear-gradient(135deg,${c.bg},#fff)`:"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:12, fontWeight:800, color:filterCat===c.id?c.color:"#6b7280", flexShrink:0, touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </header>

        {filterCat && (
          <div style={{ background:`linear-gradient(135deg,${catFor(filterCat).bg},rgba(255,255,255,0.9))`, borderBottom:`2px solid ${catFor(filterCat).color}40`, padding:"6px 14px", display:"flex", alignItems:"center", gap:8, position:"sticky", top:0, zIndex:99 }}>
            <span>{catFor(filterCat).icon}</span>
            <span style={{ fontSize:12, fontWeight:800, color:catFor(filterCat).color }}>Showing {catFor(filterCat).label} tasks only</span>
            <button onClick={() => setFilterCat(null)} style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"#94a3b8", background:"none", border:"none", cursor:"pointer", padding:"4px 8px", touchAction:"manipulation" }}>✕</button>
          </div>
        )}
      </>
    );
  }

  // ── Desktop header ────────────────────────────────────────────────────────
  return (
    <>
      <header style={{ ...glass, position:"relative", zIndex:10, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, borderBottom:"2px solid rgba(196,181,253,0.5)", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontSize:28, filter:"drop-shadow(0 0 8px #ec4899)" }}>🌸</span>
          <h1 style={{ fontFamily:"'Pacifico',cursive", fontSize:19, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", whiteSpace:"nowrap" }}>
            JingJong's Planner
          </h1>
        </div>

        <div style={{ display:"flex", gap:5, background:"rgba(237,233,254,0.8)", borderRadius:20, padding:"4px 6px", border:"2px solid rgba(124,58,237,0.3)" }}>
          {VIEWS.map(v => (
            <button key={v.id} className="tap-btn" onClick={() => setActiveView(v.id)} style={{ minWidth:52, padding:"9px 16px", borderRadius:14, border:"none", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, background:activeView===v.id?"linear-gradient(135deg,#f9a8d4,#c4b5fd)":"transparent", color:activeView===v.id?"#fff":"#7c3aed", boxShadow:activeView===v.id?"0 4px 12px rgba(196,181,253,0.6)":"none", transition:"all 0.18s ease", WebkitTapHighlightColor:"transparent" }}>
              <span style={{ marginRight:3 }}>{v.emoji}</span>{v.label}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:11, fontWeight:800, color:"#94a3b8", letterSpacing:0.5, whiteSpace:"nowrap" }}>FILTER:</span>
          <button className="filter-chip tap-btn" onClick={() => setFilterCat(null)} style={{ padding:"7px 14px", borderRadius:20, border:`2px solid ${filterCat===null?"#8b5cf6":"rgba(196,181,253,0.5)"}`, background:filterCat===null?"linear-gradient(135deg,#ec4899,#8b5cf6)":"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:12, fontWeight:800, color:filterCat===null?"#fff":"#6b7280", fontFamily:"inherit", boxShadow:filterCat===null?"0 4px 12px rgba(196,181,253,0.6)":"0 2px 4px rgba(0,0,0,0.05)", WebkitTapHighlightColor:"transparent" }}>
            ✦ All
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} className="filter-chip tap-btn" onClick={() => setFilterCat(filterCat===c.id?null:c.id)} style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 14px", borderRadius:20, border:`2px solid ${filterCat===c.id?c.color:c.color+"40"}`, background:filterCat===c.id?`linear-gradient(135deg,${c.bg},#ffffff)`:"rgba(255,255,255,0.8)", cursor:"pointer", fontSize:12, fontWeight:800, color:filterCat===c.id?c.color:"#6b7280", fontFamily:"inherit", boxShadow:filterCat===c.id?`0 4px 12px ${c.color}40`:"none", WebkitTapHighlightColor:"transparent", transition:"all 0.18s" }}>
              <span style={{ fontSize:14 }}>{c.icon}</span> {c.label}
            </button>
          ))}
          <button className="tap-btn" onClick={() => setStickerPanel(p => !p)} style={{ marginLeft:4, padding:"8px 14px", borderRadius:20, border:`2px solid rgba(124,58,237,${stickerPanel?"0.7":"0.4"})`, background:stickerPanel?"linear-gradient(135deg,#ec4899,#8b5cf6)":"rgba(255,255,255,0.8)", cursor:"pointer", fontSize:12, fontWeight:700, color:stickerPanel?"#fff":"#7c3aed", fontFamily:"inherit", transition:"all 0.18s", WebkitTapHighlightColor:"transparent", boxShadow:stickerPanel?"0 4px 12px rgba(236,72,153,0.4)":"0 2px 4px rgba(0,0,0,0.05)" }}>
            🐰 Stickers
          </button>
        </div>
      </header>

      {filterCat && (
        <div style={{ position:"relative", zIndex:9, background:`linear-gradient(135deg,${catFor(filterCat).bg},rgba(255,255,255,0.8))`, borderBottom:`2px solid ${catFor(filterCat).color}50`, padding:"6px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize:14 }}>{catFor(filterCat).icon}</span>
          <span style={{ fontSize:12, fontWeight:800, color:catFor(filterCat).color }}>Showing {catFor(filterCat).label} tasks only</span>
          <button onClick={() => setFilterCat(null)} style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:"#94a3b8", background:"none", border:"none", cursor:"pointer", padding:"2px 8px" }}>✕ Clear</button>
        </div>
      )}
    </>
  );
}
