import { MONTHS, glass } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";

const STICKER_GROUPS = [
  { label:"🐰 Bunnies & Animals", emojis:["🐰","🐇","🐣","🐥","🐮","🐸","🐼","🐨","🦊","🐹","🐶","🐱","🐻","🦝"] },
  { label:"🌸 Flowers & Nature",  emojis:["🌸","🌷","🌹","🌺","🌻","🍀","🌿","🍃","🌱","🌼","💐","🌈","⭐","✨"] },
  { label:"🧁 Sweets & Food",     emojis:["🧁","🍰","🍭","🍬","🍡","🍩","🍪","🎂","🍓","🍑","🍒","🍇"] },
  { label:"💗 Hearts & Love",     emojis:["💗","💕","💖","💝","💘","🎀","💜","💙","🩷","🩵","🤍","👑"] },
  { label:"✨ Magic & Sky",       emojis:["☁️","🌙","💫","🔮","🪄","🦋","🌊","🪸","🌝","🎵"] },
];

export default function StickerPanel({ selectedDate, placedStickers, addSticker, clearMonthStickers }) {
  const isMobile = useIsMobile();

  const panelStyle = isMobile
    ? { ...glass, position:"fixed", left:10, right:10, bottom:16, zIndex:300, borderRadius:24, padding:16, animation:"popIn 0.2s ease", maxHeight:"60vh", overflowY:"auto" }
    : { ...glass, position:"fixed", top:82, right:20, zIndex:300, borderRadius:24, padding:16, width:300, animation:"popIn 0.2s ease", maxHeight:"70vh", overflowY:"auto" };

  return (
    <div style={panelStyle}>
      <p style={{ fontSize:12, fontWeight:800, color:"#8b5cf6", marginBottom:4, letterSpacing:1, textShadow:"0 1px 2px rgba(255,255,255,0.8)" }}>
        🐰 {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()} Stickers ✦
      </p>
      <p style={{ fontSize:10, color:"#94a3b8", marginBottom:12 }}>
        {placedStickers.length} sticker{placedStickers.length !== 1 ? "s" : ""} placed this month
      </p>

      {STICKER_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom:12 }}>
          <p style={{ fontSize:10, fontWeight:800, color:"#a78bfa", marginBottom:6, letterSpacing:0.5 }}>{group.label}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {group.emojis.map(em => (
              <button key={em} className="tap-btn" onClick={() => addSticker(em)} style={{ fontSize:22, background:"rgba(237,233,254,0.6)", border:"2px solid rgba(196,181,253,0.4)", borderRadius:11, padding:"5px 7px", cursor:"pointer", transition:"transform 0.15s", WebkitTapHighlightColor:"transparent", boxShadow:"0 2px 4px rgba(0,0,0,0.05)" }}>
                {em}
              </button>
            ))}
          </div>
        </div>
      ))}

      {placedStickers.length > 0 ? (
        <div style={{ marginTop:16, borderTop:"1px solid rgba(196,181,253,0.3)", paddingTop:16 }}>
          <button className="tap-btn" onClick={clearMonthStickers} style={{ width:"100%", padding:"10px 0", borderRadius:14, border:"2px solid #ec4899", background:"linear-gradient(135deg, #fce7f3, #fff)", color:"#ec4899", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s ease", boxShadow:"0 4px 12px rgba(236,72,153,0.2)" }}>
            <span style={{ fontSize:18 }}>🗑️</span>
            Clear {MONTHS[selectedDate.getMonth()]} Stickers ({placedStickers.length})
            <span style={{ fontSize:18 }}>✨</span>
          </button>
        </div>
      ) : (
        <div style={{ marginTop:16, padding:"12px", borderRadius:12, background:"rgba(237,233,254,0.5)", textAlign:"center", fontSize:11, color:"#94a3b8", border:"1px dashed rgba(196,181,253,0.5)" }}>
          ✨ No stickers for {MONTHS[selectedDate.getMonth()]}. Tap above to add some!
        </div>
      )}
    </div>
  );
}
