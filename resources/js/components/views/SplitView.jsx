import CalGrid from "../CalGrid";
import NotebookTaskList from "../NotebookTaskList";
import QuotePanel from "../QuotePanel";
import { MONTHS, WEEKDAYS, glass, catFor, fmt } from "../../constants";
import { useIsMobile } from "../../hooks/useIsMobile";

function prevMonth(p) { const d = new Date(p.year, p.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; }
function nextMonth(p) { const d = new Date(p.year, p.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; }

export default function SplitView({
  calMonth, setCalMonth, tasks, filterCat, setFilterCat,
  selectedDate, setSelectedDate, weekDates,
  todayTasks, selKey, toggleTask, deleteTask,
  newTaskText, setNewTaskText, newTaskCat, setNewTaskCat,
  addTask, mood, setMood, loading,
}) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: isMobile ? 14 : 18, alignItems:"start" }}>

      {/* Calendar panel */}
      <section style={{ ...glass, borderRadius:28, padding: isMobile ? 14 : 22, animation:"slideUp 0.35s ease", background:"linear-gradient(160deg,rgba(255,240,248,0.98) 0%,rgba(245,238,255,0.98) 50%,rgba(235,244,255,0.98) 100%)" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: isMobile ? 10 : 16 }}>
          <button className="tap-btn" onClick={() => setCalMonth(prevMonth)} style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, borderRadius:16, background:"rgba(124,58,237,0.15)", border:"2px solid rgba(124,58,237,0.3)", cursor:"pointer", fontSize: isMobile ? 18 : 22, color:"#7c3aed", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>‹</button>
          <div style={{ textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize: isMobile ? 20 : 26, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{MONTHS[calMonth.month]}</h2>
            <span style={{ fontSize: isMobile ? 11 : 13, color:"#7c3aed", fontWeight:700 }}>{calMonth.year}</span>
            {filterCat && <div style={{ fontSize:10, color:catFor(filterCat).color, fontWeight:800, marginTop:2 }}>· {catFor(filterCat).icon} filtered</div>}
          </div>
          <button className="tap-btn" onClick={() => setCalMonth(nextMonth)} style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, borderRadius:16, background:"rgba(124,58,237,0.15)", border:"2px solid rgba(124,58,237,0.3)", cursor:"pointer", fontSize: isMobile ? 18 : 22, color:"#7c3aed", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>›</button>
        </div>

        <CalGrid calMonth={calMonth} tasks={tasks} filterCat={filterCat} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        {/* Week dots strip */}
        <div style={{ marginTop: isMobile ? 10 : 16, padding: isMobile ? "8px 8px" : "12px 14px", background:"rgba(237,233,254,0.7)", borderRadius:18, border:"2px solid rgba(124,58,237,0.2)", display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap: isMobile ? 4 : 6 }}>
          {weekDates.slice(0, 5).map(wd => {
            const wk       = fmt(wd.getFullYear(), wd.getMonth(), wd.getDate());
            const all      = tasks[wk] || [];
            const filtered = filterCat ? all.filter(t => t.cat === filterCat) : all;
            const done     = filtered.filter(t => t.done).length;
            const isSel    = wd.toDateString() === selectedDate.toDateString();
            return (
              <div key={wk} className="tap-btn" onClick={() => setSelectedDate(new Date(wd))} style={{ textAlign:"center", padding: isMobile ? "5px 2px" : "7px 4px", borderRadius:14, background:isSel?"rgba(196,181,253,0.4)":"transparent", border:isSel?"2px solid rgba(124,58,237,0.4)":"2px solid transparent", cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all 0.15s" }}>
                <p style={{ fontSize: isMobile ? 9 : 10, fontWeight:900, color:"#7c3aed", marginBottom:3 }}>{WEEKDAYS[wd.getDay()].slice(0,1)} {wd.getDate()}</p>
                <div style={{ display:"flex", gap:2, justifyContent:"center", flexWrap:"wrap" }}>
                  {Array.from({ length: filtered.length }, (_, idx) => (
                    <div key={idx} style={{ width: isMobile ? 5 : 7, height: isMobile ? 5 : 7, borderRadius:"50%", background:idx<done?"#10b981":"#ec4899" }} />
                  ))}
                  {filtered.length === 0 && <span style={{ fontSize:9, color:"#94a3b8" }}>–</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Task list + quote */}
      <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? 14 : 18 }}>
        <NotebookTaskList
          maxH={isMobile ? 320 : 260}
          todayTasks={todayTasks}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          selKey={selKey}
          selectedDate={selectedDate}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          newTaskText={newTaskText}
          setNewTaskText={setNewTaskText}
          newTaskCat={newTaskCat}
          setNewTaskCat={setNewTaskCat}
          addTask={addTask}
          mood={mood}
          setMood={setMood}
          loading={loading}
        />
        <QuotePanel />
      </div>
    </div>
  );
}
