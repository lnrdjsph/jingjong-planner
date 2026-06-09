import { WEEKDAYS, CAL_KAWAII, today, fmt, daysInMonth, firstDayOf, catFor } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";

export default function CalGrid({ calMonth, tasks, filterCat, selectedDate, setSelectedDate }) {
  const isMobile = useIsMobile();

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap: isMobile ? 2 : 4, marginBottom: isMobile ? 4 : 6 }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize: isMobile ? 10 : 12, fontWeight:900, color:"#8b5cf6", padding: isMobile ? "4px 0" : "6px 0", letterSpacing:0.3, textShadow:"0 1px 2px rgba(255,255,255,0.8)" }}>
            {isMobile ? d.slice(0, 1) : d}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap: isMobile ? 3 : 5 }}>
        {Array.from({ length: firstDayOf(calMonth.year, calMonth.month) }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth(calMonth.year, calMonth.month) }, (_, i) => {
          const d        = i + 1;
          const dateKey  = fmt(calMonth.year, calMonth.month, d);
          const allTasks = tasks[dateKey] || [];
          const dayTasks = filterCat ? allTasks.filter(t => t.cat === filterCat) : allTasks;
          const isToday    = calMonth.year === today.getFullYear() && calMonth.month === today.getMonth() && d === today.getDate();
          const isSelected = calMonth.year === selectedDate.getFullYear() && calMonth.month === selectedDate.getMonth() && d === selectedDate.getDate();
          const kawaiiDeco = CAL_KAWAII[i % CAL_KAWAII.length];

          const dayPastels = [
            "linear-gradient(135deg, #fbcfe8, #fce7f3)",
            "linear-gradient(135deg, #e0e7ff, #ede9fe)",
            "linear-gradient(135deg, #bbf7d0, #d1fae5)",
            "linear-gradient(135deg, #fed7aa, #fef3c7)",
            "linear-gradient(135deg, #c7d2fe, #e0e7ff)",
            "linear-gradient(135deg, #fbcfe8, #ffe4e6)",
            "linear-gradient(135deg, #d9f99d, #bbf7d0)",
          ];
          const dayBg = dayPastels[(d + calMonth.month) % dayPastels.length];

          return (
            <div
              key={d}
              className="cal-day tap-btn"
              onClick={() => setSelectedDate(new Date(calMonth.year, calMonth.month, d))}
              style={{
                minHeight: isMobile ? (dayTasks.length > 0 ? 52 : 42) : (dayTasks.length > 0 ? 96 : 64),
                borderRadius: isMobile ? 12 : 18,
                cursor: "pointer",
                padding: isMobile ? "4px 3px 3px" : "6px 6px 5px",
                background: isSelected ? "linear-gradient(135deg,#f9a8d4,#c4b5fd)" : isToday ? "linear-gradient(135deg,rgba(196,181,253,0.6),rgba(249,168,212,0.5))" : dayBg,
                border: isSelected ? `${isMobile ? 2 : 3}px solid #8b5cf6` : isToday ? "2px solid #ec4899" : "2px solid rgba(196,181,253,0.4)",
                boxShadow: isSelected ? "0 4px 16px rgba(139,92,246,0.5), 0 0 0 2px rgba(255,255,255,0.5) inset" : isToday ? "0 2px 10px rgba(236,72,153,0.4)" : "0 2px 8px rgba(196,181,253,0.2)",
                transition: "all 0.15s ease",
                display: "flex", flexDirection: "column", gap: 2,
                WebkitTapHighlightColor: "transparent", overflow: "hidden", position: "relative",
              }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none", background:"radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 30%)", zIndex:1 }} />

              {!isMobile && (
                <>
                  <span style={{ position:"absolute", top:-2, left:-2, fontSize:isSelected?26:22, opacity:isSelected?0.5:0.3, transform:`rotate(${isSelected?"-8deg":"-5deg"}) scale(${isSelected?1.2:1})`, pointerEvents:"none", zIndex:1, filter:"drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}>{kawaiiDeco}</span>
                  <span style={{ position:"absolute", bottom:-2, right:-2, fontSize:isSelected?20:16, opacity:isSelected?0.4:0.2, transform:`rotate(${isSelected?"5deg":"8deg"})`, pointerEvents:"none", zIndex:1, filter:"drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}>{CAL_KAWAII[(i+5) % CAL_KAWAII.length]}</span>
                </>
              )}

              <div style={{ position:"relative", zIndex:2, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: isMobile ? 1 : 2 }}>
                <span style={{ fontSize: isMobile ? 11 : (isSelected ? 16 : 14), fontWeight:isToday||isSelected?900:700, color:isSelected?"#fff":isToday?"#ec4899":"#4b5563", lineHeight:1, background:isSelected?"rgba(255,255,255,0.3)":"none", padding:isSelected?(isMobile?"1px 4px":"2px 8px"):"0", borderRadius:isSelected?"14px":"0", textShadow:isSelected?"0 1px 2px rgba(0,0,0,0.2)":"0 1px 2px rgba(255,255,255,0.8)" }}>{d}</span>
                {dayTasks.length > 0 && (
                  <span style={{ fontSize: isMobile ? 8 : 10, fontWeight:800, background:isSelected?"#fff":catFor(dayTasks[0].cat).color, color:isSelected?catFor(dayTasks[0].cat).color:"#fff", padding: isMobile ? "1px 4px" : "2px 8px", borderRadius:"14px", lineHeight:1.2 }}>
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Task previews — desktop only */}
              {!isMobile && dayTasks.slice(0, 2).map(t => {
                const c = catFor(t.cat);
                return (
                  <div key={t.id} style={{ fontSize:9, fontWeight:700, lineHeight:1.3, padding:"2px 6px", borderRadius:8, background:isSelected?"rgba(255,255,255,0.4)":c.bg, color:isSelected?"#fff":c.color, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textDecoration:t.done?"line-through":"none", opacity:t.done?0.6:1, border:isSelected?"1px solid rgba(255,255,255,0.4)":`1px solid ${c.color}40`, marginBottom:1, position:"relative", zIndex:2 }}>
                    {c.icon} {t.text}
                  </div>
                );
              })}
              {!isMobile && dayTasks.length > 2 && (
                <div style={{ fontSize:8, fontWeight:800, color:isSelected?"rgba(255,255,255,0.95)":"#8b5cf6", paddingLeft:2, position:"relative", zIndex:2 }}>
                  +{dayTasks.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
