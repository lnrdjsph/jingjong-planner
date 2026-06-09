export const KAWAII_STICKERS = [
  "🐰","🐇","🐣","🐥","🐮","🐸","🐼","🐨","🦊","🐹","🐶","🐱","🐭","🐻","🦝",
  "🌸","🌷","🌹","🌺","🌻","🍀","🌿","🍃","🌱","🌼","💐","🌈","⭐","🌟","✨",
  "🧁","🍰","🍭","🍬","🍡","🍩","🍪","🎂","🍓","🍑","🍒","🍇","🫧",
  "💗","💕","💖","💝","💘","🎀","💜","💙","🩷","🩵",
  "☁️","🌙","💫","🔮","🪄","🦋","🪸","🌊","🫐","🫧",
  "😊","🥰","😍","🤩","🥹","😻","🌝","✌️","🤍","👑",
];

export const BG_STICKERS = [
  { id:"b1",  emoji:"🐰", x:2,  y:8,  size:26, rot:15,  delay:0,   glitter:true },
  { id:"b2",  emoji:"🌸", x:93, y:11, size:30, rot:-10, delay:0.5, glitter:true },
  { id:"b3",  emoji:"💜", x:48, y:2,  size:24, rot:20,  delay:1,   glitter:true },
  { id:"b4",  emoji:"☁️", x:74, y:7,  size:34, rot:5,   delay:0.3, glitter:false },
  { id:"b5",  emoji:"✨", x:14, y:90, size:24, rot:-15, delay:0.7, glitter:true },
  { id:"b6",  emoji:"🌈", x:86, y:87, size:32, rot:8,   delay:1.2, glitter:true },
  { id:"b7",  emoji:"🐣", x:59, y:94, size:26, rot:-5,  delay:0.4, glitter:true },
  { id:"b8",  emoji:"🎀", x:5,  y:50, size:28, rot:12,  delay:0.9, glitter:true },
  { id:"b9",  emoji:"🦊", x:90, y:44, size:26, rot:-8,  delay:1.5, glitter:true },
  { id:"b10", emoji:"🍀", x:37, y:95, size:26, rot:18,  delay:0.6, glitter:true },
  { id:"b11", emoji:"🥰", x:21, y:4,  size:24, rot:-12, delay:1.1, glitter:true },
  { id:"b12", emoji:"🌺", x:79, y:95, size:28, rot:6,   delay:0.2, glitter:true },
  { id:"g1",  emoji:"✨", x:15, y:25, size:18, rot:10,  delay:0.8, glitter:true, isGlitter:true },
  { id:"g2",  emoji:"🌟", x:45, y:70, size:22, rot:-5,  delay:1.3, glitter:true, isGlitter:true },
  { id:"g3",  emoji:"💫", x:75, y:35, size:20, rot:15,  delay:0.2, glitter:true, isGlitter:true },
  { id:"g4",  emoji:"⭐", x:25, y:80, size:18, rot:-8,  delay:1.1, glitter:true, isGlitter:true },
  { id:"g5",  emoji:"✨", x:65, y:15, size:16, rot:12,  delay:0.5, glitter:true, isGlitter:true },
  { id:"g6",  emoji:"💫", x:85, y:60, size:20, rot:-12, delay:0.9, glitter:true, isGlitter:true },
];

export const CAL_KAWAII = ["🐰","🌸","🍀","✨","🐣","💗","🦋","🍭","🌙","⭐","🐮","🎀","🥰","💫","🌈","🐸","🌷","💜","🐹","🌟","🍰","🐱","💕","🌻","🐨","🎂","🍓","🐶","🌼","🪄","🐼"];

export const CATEGORIES = [
  { id:"work",     label:"Work",     color:"#6d28d9", bg:"#ede9fe", icon:"💼", vibrant:"#8b5cf6" },
  { id:"personal", label:"Personal", color:"#be185d", bg:"#fce7f3", icon:"💗", vibrant:"#ec4899" },
  { id:"shopping", label:"Shopping", color:"#047857", bg:"#d1fae5", icon:"🛒", vibrant:"#10b981" },
  { id:"health",   label:"Health",   color:"#b45309", bg:"#fef3c7", icon:"🍎", vibrant:"#f59e0b" },
];

export const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const today    = new Date();

export const fmt         = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
export const daysInMonth = (y,m)   => new Date(y,m+1,0).getDate();
export const firstDayOf  = (y,m)   => new Date(y,m,1).getDay();
export const catFor      = (id)    => CATEGORIES.find(c => c.id === id) || CATEGORIES[1];

export const glass = {
  background:"rgba(255,255,255,0.97)",
  backdropFilter:"blur(8px)",
  WebkitBackdropFilter:"blur(8px)",
  border:"2px solid rgba(139,92,246,0.5)",
  boxShadow:"0 8px 32px rgba(124,58,237,0.25), 0 4px 8px rgba(219,39,119,0.2), 0 0 0 1px rgba(255,255,255,0.8) inset",
};

export const STORAGE_KEYS = {
  stickers: "planner-stickers-by-month",
  moods:    "planner-moods",
  settings: "planner-settings",
};

export const TASK_ROW_H         = 48;
export const NOTEBOOK_TOP_OFFSET = 120;
