export default function TrashIcon({ isDragging }) {
  if (!isDragging) return null;
  return (
    <div
      id="trash-icon"
      style={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        width: 70,
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        zIndex: 1000,
        pointerEvents: "auto",
        animation: "trashPulse 0.5s ease-in-out infinite",
      }}
    >
      🗑️
    </div>
  );
}
