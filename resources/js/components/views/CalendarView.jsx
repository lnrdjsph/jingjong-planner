import CalGrid from "../CalGrid";
import { MONTHS, glass } from "../../constants";
import { useIsMobile } from "../../hooks/useIsMobile";

function prevMonth(p) { const d = new Date(p.year, p.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; }
function nextMonth(p) { const d = new Date(p.year, p.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; }

export default function CalendarView({ calMonth, setCalMonth, tasks, filterCat, selectedDate, setSelectedDate }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ ...glass, borderRadius:28, padding: isMobile ? 14 : 24, animation:"slideUp 0.35s ease", maxWidth:960, margin:"0 auto", background:"linear-gradient(160deg,rgba(255,240,248,0.98) 0%,rgba(245,238,255,0.98) 50%,rgba(235,244,255,0.98) 100%)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: isMobile ? 12 : 18 }}>
        <button className="tap-btn" onClick={() => setCalMonth(prevMonth)} style={{ width: isMobile ? 40 : 52, height: isMobile ? 40 : 52, borderRadius:16, background:"rgba(124,58,237,0.15)", border:"2px solid rgba(124,58,237,0.3)", cursor:"pointer", fontSize: isMobile ? 18 : 22, color:"#7c3aed", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>‹</button>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize: isMobile ? 22 : 28, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{MONTHS[calMonth.month]}</h2>
          <span style={{ fontSize: isMobile ? 12 : 14, color:"#7c3aed", fontWeight:700 }}>{calMonth.year}</span>
        </div>
        <button className="tap-btn" onClick={() => setCalMonth(nextMonth)} style={{ width: isMobile ? 40 : 52, height: isMobile ? 40 : 52, borderRadius:16, background:"rgba(124,58,237,0.15)", border:"2px solid rgba(124,58,237,0.3)", cursor:"pointer", fontSize: isMobile ? 18 : 22, color:"#7c3aed", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>›</button>
      </div>
      <CalGrid calMonth={calMonth} tasks={tasks} filterCat={filterCat} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </section>
  );
}
