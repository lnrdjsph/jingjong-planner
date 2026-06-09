import { WEEKDAYS, MONTHS, glass, catFor, fmt, today } from "../../constants";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function WeeklyView({ weekDates, tasks, filterCat, selectedDate, setSelectedDate }) {
  const isMobile = useIsMobile();

  const weekTotal = weekDates.reduce((s, wd) => {
    const k = fmt(wd.getFullYear(), wd.getMonth(), wd.getDate());
    const t = tasks[k] || [];
    return s + (filterCat ? t.filter(x => x.cat === filterCat) : t).length;
  }, 0);
  const weekDone = weekDates.reduce((s, wd) => {
    const k = fmt(wd.getFullYear(), wd.getMonth(), wd.getDate());
    const t = tasks[k] || [];
    return s + (filterCat ? t.filter(x => x.cat === filterCat) : t).filter(x => x.done).length;
  }, 0);
  const pct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const colBgs = [
    "linear-gradient(135deg, #fff0f5, #ffe4f5)",
    "linear-gradient(135deg, #f5f0ff, #e4f0ff)",
    "linear-gradient(135deg, #f0fff5, #e4fff0)",
    "linear-gradient(135deg, #fff0f0, #ffe4e4)",
    "linear-gradient(135deg, #f0f0ff, #e4e4ff)",
    "linear-gradient(135deg, #fff5f0, #ffe4e0)",
    "linear-gradient(135deg, #f0fff0, #e4ffe4)",
  ];

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    const selKey       = fmt(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const selAllTasks  = tasks[selKey] || [];
    const selDayTasks  = filterCat ? selAllTasks.filter(t => t.cat === filterCat) : selAllTasks;
    const doneTasks    = selDayTasks.filter(t => t.done).length;
    const isSelToday   = selectedDate.toDateString() === today.toDateString();

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

        {/* Week header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2px" }}>
          <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:16, background:"linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Weekly View ✦
          </h2>
          <span style={{ fontSize:11, color:"#7c3aed", fontWeight:700, background:"rgba(124,58,237,0.12)", padding:"4px 10px", borderRadius:12, border:"1.5px solid rgba(124,58,237,0.2)" }}>
            {MONTHS[weekDates[0].getMonth()].slice(0,3)} {weekDates[0].getDate()}–{weekDates[6].getDate()}
          </span>
        </div>

        {/* Day chip strip */}
        <div style={{ ...glass, borderRadius:24, padding:"14px 12px" }}>
          <div style={{ display:"flex", gap:6, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:2 }}>
            {weekDates.map((wd, idx) => {
              const wk       = fmt(wd.getFullYear(), wd.getMonth(), wd.getDate());
              const dt       = filterCat ? (tasks[wk]||[]).filter(t=>t.cat===filterCat) : (tasks[wk]||[]);
              const isToday    = wd.toDateString() === today.toDateString();
              const isSelected = wd.toDateString() === selectedDate.toDateString();
              const doneCount  = dt.filter(t => t.done).length;
              return (
                <button
                  key={wk}
                  onClick={() => setSelectedDate(new Date(wd))}
                  style={{
                    flexShrink: 0,
                    minWidth: 44,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "10px 8px",
                    borderRadius: 18,
                    border: isSelected ? "2px solid #8b5cf6" : isToday ? "2px solid #ec4899" : "2px solid transparent",
                    background: isSelected
                      ? "linear-gradient(135deg,#f9a8d4,#c4b5fd)"
                      : isToday
                        ? "rgba(196,181,253,0.25)"
                        : colBgs[idx],
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    boxShadow: isSelected ? "0 4px 14px rgba(139,92,246,0.35)" : "none",
                    transition: "all 0.18s ease",
                  }}
                >
                  <span style={{ fontSize:10, fontWeight:800, color:isSelected?"rgba(255,255,255,0.9)":isToday?"#ec4899":"#7c3aed", letterSpacing:0.5 }}>
                    {WEEKDAYS[wd.getDay()].slice(0,1)}
                  </span>
                  <span style={{ fontSize:17, fontWeight:900, color:isSelected?"#fff":isToday?"#ec4899":"#1f2937", lineHeight:1 }}>
                    {wd.getDate()}
                  </span>
                  {dt.length > 0 ? (
                    <div style={{ display:"flex", gap:2 }}>
                      {dt.slice(0,3).map((t,i) => (
                        <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:isSelected?"rgba(255,255,255,0.8)":catFor(t.cat).color, opacity:i<doneCount?0.4:1 }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"transparent" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day task list */}
        <div style={{ ...glass, borderRadius:24, padding:"16px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:20, fontWeight:700, color:"#7c3aed" }}>
                {isSelToday ? "Today" : WEEKDAYS[selectedDate.getDay()]}
                {" "}
                <span style={{ fontSize:14, color:"#ec4899" }}>
                  {MONTHS[selectedDate.getMonth()].slice(0,3)} {selectedDate.getDate()}
                </span>
              </h3>
            </div>
            <div style={{ background:"linear-gradient(135deg,#f9a8d4,#c4b5fd)", borderRadius:12, padding:"5px 10px", textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff", lineHeight:1 }}>{doneTasks}/{selDayTasks.length}</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.9)", fontWeight:700 }}>done</div>
            </div>
          </div>

          {selDayTasks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:36 }}>🌸</span>
              <p style={{ fontFamily:"'Caveat',cursive", fontSize:16, color:"#a78bfa" }}>Free day! Nothing planned.</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {selDayTasks.map(t => {
                const cat = catFor(t.cat);
                return (
                  <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:14, background:t.done?"rgba(237,233,254,0.4)":cat.bg, border:`1.5px solid ${cat.color}30`, opacity:t.done?0.65:1 }}>
                    <div style={{ width:22, height:22, borderRadius:8, flexShrink:0, background:t.done?`linear-gradient(135deg,${cat.color},${cat.vibrant})`:"rgba(255,255,255,0.9)", border:`2px solid ${t.done?cat.color:cat.color+"60"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {t.done && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                    </div>
                    <span style={{ flex:1, fontFamily:"'Caveat',cursive", fontSize:16, fontWeight:600, color:t.done?"#94a3b8":"#1e293b", textDecoration:t.done?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {cat.icon} {t.text}
                    </span>
                    <span style={{ fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:8, background:"rgba(255,255,255,0.7)", color:cat.color, flexShrink:0 }}>
                      {t.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{ ...glass, borderRadius:20, padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:10, fontWeight:900, color:"#7c3aed", letterSpacing:0.5 }}>WEEKLY PROGRESS</span>
            <span style={{ fontSize:10, fontWeight:900, color:"#ec4899" }}>{weekDone}/{weekTotal} done ✨</span>
          </div>
          <div style={{ background:"rgba(124,58,237,0.15)", borderRadius:8, height:9, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#f9a8d4,#c4b5fd,#818cf8)", borderRadius:8, transition:"width 0.5s ease", boxShadow:"0 0 8px #c4b5fd" }} />
          </div>
        </div>

      </div>
    );
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <section style={{ ...glass, borderRadius:28, padding:20, animation:"slideUp 0.35s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:17, background:"linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Weekly View ✦</h2>
        <div style={{ fontSize:12, color:"#7c3aed", fontWeight:700, background:"rgba(124,58,237,0.15)", padding:"6px 14px", borderRadius:12, border:"2px solid rgba(124,58,237,0.25)" }}>
          {MONTHS[weekDates[0].getMonth()].slice(0,3)} {weekDates[0].getDate()} – {weekDates[6].getDate()}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
        {weekDates.map((wd, idx) => {
          const wk       = fmt(wd.getFullYear(), wd.getMonth(), wd.getDate());
          const allT     = tasks[wk] || [];
          const dayTasks = filterCat ? allT.filter(t => t.cat === filterCat) : allT;
          const isToday    = wd.toDateString() === today.toDateString();
          const isSelected = wd.toDateString() === selectedDate.toDateString();
          return (
            <div key={wk} className="tap-btn" onClick={() => setSelectedDate(new Date(wd))} style={{ borderRadius:18, padding:"10px 7px", cursor:"pointer", minHeight:170, background:isSelected?"linear-gradient(160deg,rgba(249,168,212,0.5),rgba(196,181,253,0.5))":colBgs[idx], border:isSelected?"2px solid #8b5cf6":isToday?"2px solid #ec4899":"2px solid rgba(196,181,253,0.3)", boxShadow:isSelected?"0 4px 18px rgba(139,92,246,0.25)":"none", transition:"all 0.18s ease", WebkitTapHighlightColor:"transparent" }}>
              <div style={{ textAlign:"center", marginBottom:7 }}>
                <p style={{ fontSize:9, fontWeight:900, color:"#7c3aed", letterSpacing:1.2 }}>{WEEKDAYS[wd.getDay()].toUpperCase()}</p>
                <div style={{ width:32, height:32, borderRadius:"50%", margin:"3px auto", background:isToday?"linear-gradient(135deg,#f9a8d4,#c4b5fd)":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:14, fontWeight:800, color:isToday?"#fff":"#1f2937" }}>{wd.getDate()}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {dayTasks.slice(0,4).map(t => (
                  <div key={t.id} style={{ padding:"4px 6px", borderRadius:9, fontSize:10, fontWeight:700, lineHeight:1.3, background:catFor(t.cat).bg, color:catFor(t.cat).color, textDecoration:t.done?"line-through":"none", opacity:t.done?0.6:1, border:`1px solid ${catFor(t.cat).color}30`, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {catFor(t.cat).icon} {t.text}
                  </div>
                ))}
                {dayTasks.length > 4 && <div style={{ fontSize:10, color:"#7c3aed", fontWeight:800, textAlign:"center" }}>+{dayTasks.length - 4}</div>}
                {dayTasks.length === 0 && <div style={{ fontSize:10, color:"#94a3b8", textAlign:"center", marginTop:6, fontStyle:"italic" }}>free 🌸</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(237,233,254,0.7)", borderRadius:18, border:"2px solid rgba(124,58,237,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:900, color:"#7c3aed", letterSpacing:0.5 }}>WEEKLY PROGRESS</span>
          <span style={{ fontSize:11, fontWeight:900, color:"#ec4899" }}>{weekDone}/{weekTotal} done ✨</span>
        </div>
        <div style={{ background:"rgba(124,58,237,0.15)", borderRadius:8, height:9, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#f9a8d4,#c4b5fd,#818cf8)", borderRadius:8, transition:"width 0.5s ease", boxShadow:"0 0 8px #c4b5fd" }} />
        </div>
      </div>
    </section>
  );
}
