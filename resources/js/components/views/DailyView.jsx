import NotebookTaskList from "../NotebookTaskList";
import QuotePanel from "../QuotePanel";
import { useIsMobile } from "../../hooks/useIsMobile";
import { WEEKDAYS, MONTHS } from "../../constants";

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function DailyView({
  todayTasks, filterCat, setFilterCat, selKey, selectedDate, setSelectedDate,
  toggleTask, deleteTask, newTaskText, setNewTaskText,
  newTaskCat, setNewTaskCat, addTask, mood, setMood, loading,
}) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? 12 : 0 }}>
      {/* Mobile date navigator */}
      {isMobile && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", borderRadius:20, padding:"10px 14px", border:"1.5px solid rgba(196,181,253,0.4)", boxShadow:"0 2px 12px rgba(124,58,237,0.1)" }}>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            style={{ width:36, height:36, borderRadius:12, border:"1.5px solid rgba(196,181,253,0.5)", background:"rgba(237,233,254,0.7)", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}
          >
            ‹
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Pacifico',cursive", fontSize:15, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {WEEKDAYS[selectedDate.getDay()]}
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:"#7c3aed" }}>
              {MONTHS[selectedDate.getMonth()].slice(0,3)} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </div>
          </div>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            style={{ width:36, height:36, borderRadius:12, border:"1.5px solid rgba(196,181,253,0.5)", background:"rgba(237,233,254,0.7)", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}
          >
            ›
          </button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 18, maxWidth:960, margin:"0 auto", width:"100%" }}>
        <NotebookTaskList
          maxH={isMobile ? 360 : 420}
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
