import { CATEGORIES, TASK_ROW_H, NOTEBOOK_TOP_OFFSET, catFor } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function NotebookLines({ taskCount, isMobile }) {
  const lineCount = Math.max(taskCount + 3, 8);
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:"inherit" }}>
      <div style={{ position:"absolute", left: isMobile ? 38 : 50, top:0, bottom:0, width:2, background:"rgba(248,113,113,0.5)" }} />
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} style={{
          position:"absolute", left:0, right:0,
          top: NOTEBOOK_TOP_OFFSET + i * TASK_ROW_H,
          height:1.5,
          background:"linear-gradient(90deg, rgba(147,197,253,0.7), rgba(196,181,253,0.7))",
        }} />
      ))}
    </div>
  );
}

export default function NotebookTaskList({
  maxH = 280, todayTasks, filterCat, setFilterCat, selKey, selectedDate,
  toggleTask, deleteTask, newTaskText, setNewTaskText,
  newTaskCat, setNewTaskCat, addTask, mood, setMood, loading,
}) {
  const isMobile = useIsMobile();
  const leftW    = isMobile ? 38 : 50;
  const holeSize = isMobile ? 13 : 17;
  const holeGap  = isMobile ? 20 : 25;
  const holeCount = isMobile ? 10 : 16;

  if (loading) {
    return (
      <section style={{ position:"relative", borderRadius:28, overflow:"hidden", background:"#fffdf7", boxShadow:"0 8px 32px rgba(124,58,237,0.12)", border:"1.5px solid rgba(196,181,253,0.45)", minHeight:maxH, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
        <div style={{ fontSize:32, animation:"floatBob 1.2s ease-in-out infinite" }}>🌸</div>
        <p style={{ fontFamily:"'Caveat',cursive", fontSize:16, color:"#a78bfa", fontWeight:600 }}>Loading your tasks...</p>
      </section>
    );
  }

  const filteredTasks = filterCat ? todayTasks.filter(t => t.cat === filterCat) : todayTasks;

  let displayTasks = filteredTasks;
  if (mood) {
    switch (mood) {
      case "😊": displayTasks = filteredTasks.filter(t => t.done);                break;
      case "😌": displayTasks = filteredTasks.filter(t => t.priority === "low");  break;
      case "😴": displayTasks = filteredTasks.filter(t => !t.done);               break;
      case "🤔": displayTasks = filteredTasks.filter(t => t.priority === "medium"); break;
      case "✨": displayTasks = filteredTasks.filter(t => t.priority === "high"); break;
      default:   displayTasks = filteredTasks;
    }
  }

  const completedCount = displayTasks.filter(t => t.done).length;

  return (
    <section style={{ position:"relative", borderRadius:28, overflow:"hidden", animation:"slideUp 0.35s ease 0.08s both", background:"#fffdf7", boxShadow:"0 8px 32px rgba(124,58,237,0.15), 4px 4px 0 rgba(196,181,253,0.4), 6px 6px 0 rgba(249,168,212,0.3), 8px 8px 0 rgba(236,72,153,0.2)", border:"2px solid rgba(196,181,253,0.6)" }}>
      <NotebookLines taskCount={filteredTasks.length} isMobile={isMobile} />

      <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none", background:"radial-gradient(circle at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 10%), radial-gradient(circle at 90% 80%, rgba(255,215,0,0.15) 0%, transparent 20%)", zIndex:1 }} />

      {/* Binding strip with holes */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:leftW, background:"rgba(248,231,243,0.7)", borderRight:"2px solid rgba(248,113,113,0.35)", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:18, gap:holeGap }}>
        {Array.from({ length: holeCount }, (_, i) => (
          <div key={i} style={{ width:holeSize, height:holeSize, borderRadius:"50%", background:"linear-gradient(135deg,#f0f4ff,#e2e8f0)", border:"2px solid #94a3b8", boxShadow:"inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.9)", flexShrink:0 }} />
        ))}
      </div>

      <div style={{ position:"relative", zIndex:2, paddingLeft: leftW + 10, paddingRight: isMobile ? 10 : 16, paddingTop:14, paddingBottom:16, display:"flex", flexDirection:"column" }}>

        {/* Header row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Caveat',cursive", fontSize: isMobile ? 20 : 24, color:"#7c3aed", fontWeight:700, lineHeight:1, textShadow:"0 2px 4px rgba(124,58,237,0.2)" }}>
              {filterCat ? `${catFor(filterCat).icon} ${catFor(filterCat).label} Tasks` : `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()} Tasks`}
            </h2>
            <p style={{ fontFamily:"'Caveat',cursive", fontSize: isMobile ? 12 : 14, color:"#ec4899", fontWeight:600, marginTop:2 }}>
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
              {filterCat && <span style={{ marginLeft:6, fontSize:11, color:catFor(filterCat).color }}>· {catFor(filterCat).icon} only</span>}
              {mood && <span style={{ marginLeft:6, fontSize:11, color:"#8b5cf6", background:"rgba(139,92,246,0.1)", padding:"2px 6px", borderRadius:12 }}>· {mood}</span>}
            </p>
          </div>
          <div style={{ background:"linear-gradient(135deg,#f9a8d4,#c4b5fd)", borderRadius:14, padding: isMobile ? "5px 8px" : "7px 12px", textAlign:"center", boxShadow:"0 4px 12px rgba(196,181,253,0.5), 0 0 0 1px rgba(255,255,255,0.5) inset", flexShrink:0 }}>
            <div style={{ fontSize: isMobile ? 16 : 20, fontWeight:900, color:"#fff", lineHeight:1, textShadow:"0 2px 4px rgba(0,0,0,0.1)" }}>{completedCount}/{displayTasks.length}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.95)", fontWeight:700 }}>done</div>
          </div>
        </div>

        {/* Task list */}
        <div style={{ display:"flex", flexDirection:"column", overflowY:"auto", maxHeight:maxH }}>
          {displayTasks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"20px 0", height:TASK_ROW_H*3, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:34, marginBottom:6, filter:"drop-shadow(0 0 8px rgba(236,72,153,0.5))" }}>
                {mood ? mood : (filterCat ? catFor(filterCat).icon : "🐰")}
              </div>
              <p style={{ fontFamily:"'Caveat',cursive", fontSize: isMobile ? 14 : 16, color:"#a78bfa" }}>
                {mood ? `No tasks match your ${mood} mood!` : filterCat ? `No ${catFor(filterCat).label} tasks for today!` : "No tasks for today! Add one above ✨"}
              </p>
              {mood && (
                <button className="tap-btn" onClick={() => setMood(null)} style={{ marginTop:8, padding:"4px 12px", borderRadius:12, border:"1px solid rgba(124,58,237,0.4)", background:"rgba(255,255,255,0.9)", fontSize:11, fontWeight:600, color:"#7c3aed", cursor:"pointer" }}>
                  Clear mood filter
                </button>
              )}
              {filterCat && !mood && (
                <button className="tap-btn" onClick={() => setFilterCat(null)} style={{ marginTop:8, padding:"4px 12px", borderRadius:12, border:"1px solid rgba(124,58,237,0.4)", background:"rgba(255,255,255,0.9)", fontSize:11, fontWeight:600, color:"#7c3aed", cursor:"pointer" }}>
                  Show all tasks
                </button>
              )}
            </div>
          ) : (
            displayTasks.map((task, i) => {
              const cat = catFor(task.cat);
              return (
                <div key={task.id} className="task-row" onClick={() => toggleTask(selKey, task.id)} style={{ display:"flex", alignItems:"center", gap: isMobile ? 6 : 8, height:TASK_ROW_H, flexShrink:0, padding:"0 4px 0 0", cursor:"pointer", animation:`lineIn 0.25s ease ${i*0.04}s both`, WebkitTapHighlightColor:"transparent", transition:"background 0.15s", borderRadius:8 }}>
                  <div style={{ width: isMobile ? 22 : 26, height: isMobile ? 22 : 26, borderRadius:9, flexShrink:0, border:`2.5px solid ${task.done?cat.color:cat.color+"80"}`, background:task.done?`linear-gradient(135deg,${cat.color},${cat.vibrant})`:"rgba(255,255,255,0.95)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.18s", boxShadow:task.done?`0 3px 8px ${cat.color}60`:"0 2px 4px rgba(0,0,0,0.05)" }}>
                    {task.done && <span style={{ color:"#fff", fontSize: isMobile ? 11 : 13, fontWeight:900, lineHeight:1 }}>✓</span>}
                  </div>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:cat.color, flexShrink:0 }} />
                  <span style={{ flex:1, fontFamily:"'Caveat',cursive", fontSize: isMobile ? 15 : 16, fontWeight:600, color:task.done?"#94a3b8":"#1e293b", textDecoration:task.done?"line-through":"none", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {cat.icon} {task.text}
                  </span>
                  {!isMobile && (
                    <span style={{ fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:7, background:task.priority==="high"?"#fce7f3":task.priority==="medium"?"#ede9fe":"#d1fae5", color:task.priority==="high"?"#ec4899":task.priority==="medium"?"#8b5cf6":"#10b981", flexShrink:0, letterSpacing:0.3, whiteSpace:"nowrap", border:`1px solid ${task.priority==="high"?"#ec4899":task.priority==="medium"?"#8b5cf6":"#10b981"}30` }}>
                      {task.priority}
                    </span>
                  )}
                  <button className="tap-btn" onClick={e => { e.stopPropagation(); deleteTask(selKey, task.id); }} style={{ width: isMobile ? 32 : 30, height: isMobile ? 32 : 30, borderRadius:10, background:"rgba(252,231,243,0.7)", border:"1.5px solid rgba(219,39,119,0.3)", cursor:"pointer", fontSize:12, color:"#ec4899", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s", WebkitTapHighlightColor:"transparent" }}>✕</button>
                </div>
              );
            })
          )}
        </div>

        {/* Add task area */}
        {(!filterCat || filterCat === newTaskCat) && (
          <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:7 }}>
            <div style={{ display:"flex", gap: isMobile ? 4 : 5 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} className="tap-btn" onClick={() => setNewTaskCat(c.id)} style={{ flex:1, minHeight: isMobile ? 36 : 38, borderRadius:12, border:`2.5px solid ${newTaskCat===c.id?c.color:c.color+"40"}`, background:newTaskCat===c.id?`linear-gradient(135deg,${c.bg},white)`:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize: isMobile ? 14 : 16, transition:"all 0.15s", boxShadow:newTaskCat===c.id?`0 3px 10px ${c.color}40`:"none", WebkitTapHighlightColor:"transparent", opacity:filterCat&&filterCat!==c.id?0.5:1 }} disabled={filterCat&&filterCat!==c.id}>
                  {c.icon}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:7 }}>
              <input
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); addTask(); } }}
                placeholder={filterCat ? `Add a ${catFor(filterCat).label} task... ✍️` : "Write a task... ✍️"}
                style={{ flex:1, minHeight:44, padding:"9px 12px", borderRadius:14, border:"2px solid rgba(124,58,237,0.4)", background:"rgba(255,255,255,0.98)", fontSize: isMobile ? 14 : 15, fontFamily:"'Caveat',cursive", fontWeight:600, color:"#1e293b", boxShadow:"inset 0 2px 6px rgba(124,58,237,0.1)" }}
              />
              <button type="button" className="tap-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); addTask(); }} style={{ minWidth:44, minHeight:44, borderRadius:14, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#f9a8d4,#c4b5fd)", boxShadow:"0 4px 14px rgba(196,181,253,0.6), 0 0 0 1px rgba(255,255,255,0.5) inset", color:"#fff", fontWeight:900, fontSize:22, WebkitTapHighlightColor:"transparent", transition:"all 0.18s" }}>+</button>
            </div>
          </div>
        )}

        {filterCat && filterCat !== newTaskCat && (
          <div style={{ marginTop:12, padding:"12px", borderRadius:14, background:"rgba(237,233,254,0.8)", border:"2px dashed rgba(124,58,237,0.4)", textAlign:"center", fontSize:12, color:"#6d28d9" }}>
            <span style={{ marginRight:4 }}>{catFor(filterCat).icon}</span>
            Showing {catFor(filterCat).label} tasks only.
            <button onClick={() => setNewTaskCat(filterCat)} style={{ marginLeft:8, padding:"2px 8px", borderRadius:10, background:catFor(filterCat).bg, border:"1px solid", borderColor:catFor(filterCat).color, color:catFor(filterCat).color, fontSize:11, fontWeight:600, cursor:"pointer" }}>
              Switch to {catFor(filterCat).icon}
            </button>
          </div>
        )}

        {/* Mood filter */}
        <div style={{ marginTop:10, padding:"8px 10px", background:"rgba(237,233,254,0.7)", borderRadius:16, border:"2px solid rgba(124,58,237,0.25)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Caveat',cursive", fontSize: isMobile ? 12 : 14, fontWeight:700, color:"#6d28d9", flexShrink:0 }}>
            {mood ? `${mood}` : "Mood:"}
          </span>
          <div style={{ display:"flex", gap: isMobile ? 2 : 3 }}>
            {["😊","😌","😴","🤔","✨"].map(m => (
              <button key={m} className="tap-btn" onClick={() => setMood(mood===m?null:m)} style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius:11, background:mood===m?"rgba(196,181,253,0.7)":"rgba(255,255,255,0.7)", border:mood===m?"2px solid #8b5cf6":"2px solid transparent", cursor:"pointer", fontSize: isMobile ? 16 : 19, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", WebkitTapHighlightColor:"transparent", transform:mood===m?"scale(1.1)":"scale(1)" }}>
                {m}
              </button>
            ))}
            {mood && (
              <button className="tap-btn" onClick={() => setMood(null)} style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius:11, background:"rgba(255,255,255,0.7)", border:"2px solid #94a3b8", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b", marginLeft:2 }}>✕</button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
