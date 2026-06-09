import { useState, useEffect, useCallback } from "react";
import { BG_STICKERS, STORAGE_KEYS, today, fmt, daysInMonth } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";
import DraggableSticker from "./DraggableSticker";
import TrashIcon        from "./TrashIcon";
import Header           from "./Header";
import StickerPanel     from "./StickerPanel";
import BottomNav        from "./BottomNav";
import SplitView    from "./views/SplitView";
import CalendarView from "./views/CalendarView";
import WeeklyView   from "./views/WeeklyView";
import DailyView    from "./views/DailyView";

// ── Storage helpers ────────────────────────────────────────────────────────
async function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Storage load error:", e);
  }
  return fallback;
}

async function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

// ── Week helper ────────────────────────────────────────────────────────────
function getWeekDates(d) {
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(mon);
    nd.setDate(mon.getDate() + i);
    return nd;
  });
}

// ══════════════════════════════════════════════════════════════════════════
export default function TaskPlanner() {
  const [activeView,      setActiveView]      = useState("split");
  const [selectedDate,    setSelectedDate]    = useState(today);
  const [calMonth,        setCalMonth]        = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [tasks,           setTasks]           = useState({});
  const [loading,         setLoading]         = useState(true);
  const [newTaskText,     setNewTaskText]     = useState("");
  const [newTaskCat,      setNewTaskCat]      = useState("personal");
  const [stickerPanel,    setStickerPanel]    = useState(false);
  const [stickersByMonth, setStickersByMonth] = useState({});
  const [filterCat,       setFilterCat]       = useState(null);
  const [isDragging,      setIsDragging]      = useState(false);
  const [moodMap,         setMoodMap]         = useState({});
  const [isLoaded,        setIsLoaded]        = useState(false);

  const selKey = fmt(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const mood   = moodMap[selKey] || null;
  const setMood = (m) => setMoodMap(prev => ({ ...prev, [selKey]: m }));

  const isMobile  = useIsMobile();
  const weekDates = getWeekDates(selectedDate);

  const currentMonthKey  = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
  const placedStickers   = stickersByMonth[currentMonthKey] || [];

  // ── API ──────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      const start = startDate ?? fmt(calMonth.year, calMonth.month, 1);
      const end   = endDate   ?? fmt(calMonth.year, calMonth.month, daysInMonth(calMonth.year, calMonth.month));
      const res   = await fetch(`/api/tasks?start=${start}&end=${end}`);
      const data  = await res.json();

      const byDate = {};
      data.forEach(task => {
        const date = task.task_date;
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push({ id: task.id, text: task.text, done: task.done || false, cat: task.category, priority: task.priority || "medium" });
      });
      setTasks(byDate);
    } catch (e) {
      console.error("Error fetching tasks:", e);
      setTasks({});
    } finally {
      setLoading(false);
    }
  }, [calMonth]);

  useEffect(() => {
    const start = fmt(calMonth.year, calMonth.month, 1);
    const end   = fmt(calMonth.year, calMonth.month, daysInMonth(calMonth.year, calMonth.month));
    fetchTasks(start, end);
  }, [calMonth, fetchTasks]);

  useEffect(() => {
    if (isLoaded) {
      const start = fmt(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const end   = fmt(selectedDate.getFullYear(), selectedDate.getMonth(), daysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()));
      fetchTasks(start, end);
    }
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTask = async (key, id) => {
    const task = tasks[key]?.find(t => t.id === id);
    if (!task) return;
    setTasks(p => ({ ...p, [key]: (p[key] || []).map(t => t.id === id ? { ...t, done: !t.done } : t) }));
    try {
      await fetch(`/api/tasks/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ done: !task.done }) });
    } catch {
      setTasks(p => ({ ...p, [key]: (p[key] || []).map(t => t.id === id ? { ...t, done: task.done } : t) }));
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    const tempId  = Date.now();
    const newTask = { id: tempId, text: newTaskText, done: false, cat: newTaskCat, priority: "medium" };
    setTasks(p => ({ ...p, [selKey]: [...(p[selKey] || []), newTask] }));
    setNewTaskText("");
    try {
      const res  = await fetch("/api/tasks", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ task_date: selKey, text: newTaskText, category: newTaskCat, priority: "medium" }) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setTasks(p => ({ ...p, [selKey]: (p[selKey] || []).map(t => t.id === tempId ? { id: saved.id, text: saved.text, done: saved.done || false, cat: saved.category, priority: saved.priority || "medium" } : t) }));
    } catch {
      setTasks(p => ({ ...p, [selKey]: (p[selKey] || []).filter(t => t.id !== tempId) }));
    }
  };

  const deleteTask = async (key, id) => {
    const task = tasks[key]?.find(t => t.id === id);
    if (!task) return;
    setTasks(p => ({ ...p, [key]: (p[key] || []).filter(t => t.id !== id) }));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method:"DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(p => ({ ...p, [key]: [...(p[key] || []), task] }));
    }
  };

  // ── Stickers ─────────────────────────────────────────────────────────────
  const addSticker = (emoji) => {
    const x = 80 + Math.random() * (window.innerWidth - 200);
    const y = 100 + Math.random() * (window.innerHeight - 200);
    setStickersByMonth(prev => ({ ...prev, [currentMonthKey]: [...(prev[currentMonthKey] || []), { id: Date.now(), emoji, x, y, size: 36 }] }));
  };

  const moveSticker = (id, x, y) => {
    setStickersByMonth(prev => ({ ...prev, [currentMonthKey]: (prev[currentMonthKey] || []).map(s => s.id === id ? { ...s, x, y } : s) }));
  };

  const deleteSticker = (id) => {
    setStickersByMonth(prev => ({ ...prev, [currentMonthKey]: (prev[currentMonthKey] || []).filter(s => s.id !== id) }));
  };

  const clearMonthStickers = () => {
    setStickersByMonth(prev => ({ ...prev, [currentMonthKey]: [] }));
  };

  // ── Storage ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      const [savedStickers, savedMoods, savedSettings] = await Promise.all([
        loadFromStorage(STORAGE_KEYS.stickers, {}),
        loadFromStorage(STORAGE_KEYS.moods, {}),
        loadFromStorage(STORAGE_KEYS.settings, { activeView: "split", filterCat: null }),
      ]);
      setStickersByMonth(savedStickers);
      setMoodMap(savedMoods);
      setActiveView(savedSettings.activeView || "split");
      setFilterCat(savedSettings.filterCat || null);
      setIsLoaded(true);
    }
    loadAll();
  }, []);

  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.stickers, stickersByMonth); }, [stickersByMonth, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.moods,    moodMap);         }, [moodMap, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.settings, { activeView, filterCat }); }, [activeView, filterCat, isLoaded]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const todayTasks = (() => {
    const t = tasks[selKey] || [];
    return filterCat ? t.filter(t => t.cat === filterCat) : t;
  })();

  const taskListProps = { todayTasks, filterCat, setFilterCat, selKey, selectedDate, setSelectedDate, toggleTask, deleteTask, newTaskText, setNewTaskText, newTaskCat, setNewTaskCat, addTask, mood, setMood, loading };

  if (!isLoaded) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fce7f3,#ede9fe,#e0e7ff)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
        <div style={{ fontSize:48, animation:"floatBob 1.2s ease-in-out infinite", filter:"drop-shadow(0 0 12px #ec4899)" }}>🐰</div>
        <p style={{ fontFamily:"'Caveat',cursive", fontSize:20, color:"#8b5cf6", fontWeight:700 }}>Loading your planner...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fbcfe8 0%,#ddd6fe 30%,#c7d2fe 60%,#fbcfe8 100%)", fontFamily:"'Nunito','Segoe UI',sans-serif", position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Pacifico&family=Caveat:wght@500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.4);border-radius:4px}
        @keyframes floatBob{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-10px) rotate(calc(var(--rot,0deg) + 5deg))}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
        @keyframes lineIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes trashPulse{0%,100%{transform:translateX(-50%) scale(1.1)}50%{transform:translateX(-50%) scale(1.2)}}
        @keyframes glitter{0%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}100%{opacity:0.3;transform:scale(1)}}
        .tap-btn:active{transform:scale(.93)!important;opacity:.82}
        .cal-day:active{transform:scale(.90)!important}
        .task-row:hover{background:rgba(237,233,254,0.45)!important}
        input:focus{outline:none;border-color:#8b5cf6!important;box-shadow:0 0 0 3px rgba(139,92,246,0.2)!important}
        .filter-chip:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(139,92,246,0.3)!important}
        .filter-chip{transition:all 0.18s ease!important}
        button,a{touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
        html{-webkit-text-size-adjust:100%;}
        body{overscroll-behavior-y:contain;}
        @supports(padding:env(safe-area-inset-bottom)){
          .safe-bottom{padding-bottom:env(safe-area-inset-bottom,0px)!important;}
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-15%", left:"-10%",  width:620, height:620, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,0.4) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"30%",  right:"-12%", width:540, height:540, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.45) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:"-10%", left:"25%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.3) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"15%",  left:"30%",   width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,0.3) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"60%",  left:"60%",   width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,0.35) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"40%",  left:"10%",   width:100, height:100, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,215,0,0.15) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"70%",  left:"80%",   width:150, height:150, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,182,193,0.2) 0%,transparent 70%)" }} />
      </div>

      {/* Ambient floating stickers — skip on mobile for performance */}
      {!isMobile && BG_STICKERS.map(s => (
        <div key={s.id} style={{ position:"fixed", left:`${s.x}%`, top:`${s.y}%`, fontSize:s.size, "--rot":`${s.rot}deg`, animation:`floatBob ${3+s.delay}s ease-in-out infinite`, animationDelay:`${s.delay}s`, zIndex:1, pointerEvents:"none", filter:s.glitter ? "drop-shadow(0 0 8px rgba(255,215,0,0.5))" : "drop-shadow(0 2px 8px rgba(196,181,253,0.4))", userSelect:"none", opacity:s.isGlitter ? 0.8 : 1 }}>
          {s.emoji}
          {s.glitter && <span style={{ position:"absolute", top:"-20%", right:"-20%", fontSize:s.size/2, animation:`glitter ${1+s.delay}s ease-in-out infinite` }}>✨</span>}
        </div>
      ))}

      {/* Draggable placed stickers — desktop only */}
      {!isMobile && placedStickers.map(s => (
        <DraggableSticker key={s.id} sticker={s} onMove={moveSticker} onDelete={deleteSticker} onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)} isAnyDragging={isDragging} />
      ))}
      {!isMobile && <TrashIcon isDragging={isDragging} />}

      <Header activeView={activeView} setActiveView={setActiveView} filterCat={filterCat} setFilterCat={setFilterCat} stickerPanel={stickerPanel} setStickerPanel={setStickerPanel} selectedDate={selectedDate} />

      {stickerPanel && (
        <StickerPanel selectedDate={selectedDate} placedStickers={placedStickers} addSticker={addSticker} clearMonthStickers={clearMonthStickers} />
      )}

      <main style={{ position:"relative", zIndex:5, padding: isMobile ? "12px 12px 80px" : "16px 18px 24px", maxWidth:1600, margin:"0 auto" }}>
        {activeView === "split" && (
          <SplitView calMonth={calMonth} setCalMonth={setCalMonth} tasks={tasks} selectedDate={selectedDate} setSelectedDate={setSelectedDate} weekDates={weekDates} {...taskListProps} />
        )}
        {activeView === "calendar" && (
          <CalendarView calMonth={calMonth} setCalMonth={setCalMonth} tasks={tasks} filterCat={filterCat} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        )}
        {activeView === "weekly" && (
          <WeeklyView weekDates={weekDates} tasks={tasks} filterCat={filterCat} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        )}
        {activeView === "daily" && (
          <DailyView {...taskListProps} />
        )}
      </main>

      {isMobile
        ? <BottomNav activeView={activeView} setActiveView={setActiveView} />
        : (
          <footer style={{ position:"relative", zIndex:5, textAlign:"center", padding:"10px 0 22px", fontFamily:"'Caveat',cursive", fontSize:15, color:"#7c3aed", fontWeight:600, letterSpacing:0.3, textShadow:"0 1px 2px rgba(255,255,255,0.8)" }}>
            🐰 JingJong's Planner — stay organized, stay dreamy 🌸✨
          </footer>
        )
      }
    </div>
  );
}
