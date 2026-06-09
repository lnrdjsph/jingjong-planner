const VIEWS = [
  { id:"split",    label:"Home",     emoji:"🏠" },
  { id:"calendar", label:"Calendar", emoji:"📅" },
  { id:"weekly",   label:"Week",     emoji:"🗓" },
  { id:"daily",    label:"Today",    emoji:"📋" },
];

export default function BottomNav({ activeView, setActiveView }) {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 110,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1.5px solid rgba(196,181,253,0.5)",
      display: "flex",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      boxShadow: "0 -4px 24px rgba(124,58,237,0.12)",
    }}>
      {VIEWS.map(v => {
        const active = activeView === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "10px 4px 8px",
              border: "none",
              background: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              minHeight: 56,
              position: "relative",
            }}
          >
            {active && (
              <div style={{
                position: "absolute",
                top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 32, height: 3,
                borderRadius: "0 0 4px 4px",
                background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
              }} />
            )}
            <span style={{
              fontSize: 22,
              filter: active ? "drop-shadow(0 0 6px rgba(236,72,153,0.6))" : "none",
              transition: "filter 0.2s",
            }}>
              {v.emoji}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: active ? 800 : 500,
              color: active ? "#7c3aed" : "#94a3b8",
              fontFamily: "'Nunito',sans-serif",
              letterSpacing: 0.3,
              transition: "color 0.2s",
            }}>
              {v.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
