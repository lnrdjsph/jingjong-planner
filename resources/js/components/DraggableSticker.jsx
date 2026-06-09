import { useState, useRef } from "react";

export default function DraggableSticker({ sticker, onMove, onDelete, onDragStart, onDragEnd, isAnyDragging }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [isOverTrash, setIsOverTrash] = useState(false);

  const onPointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    onDragStart && onDragStart(sticker.id);
    offset.current = { x: e.clientX - sticker.x, y: e.clientY - sticker.y };
    ref.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    onMove(sticker.id, e.clientX - offset.current.x, e.clientY - offset.current.y);

    const trashEl = document.getElementById("trash-icon");
    if (trashEl) {
      const r = trashEl.getBoundingClientRect();
      const over = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      setIsOverTrash(over);
      trashEl.style.transform = over ? "translateX(-50%) scale(1.3)" : "translateX(-50%) scale(1.1)";
    }
  };

  const onPointerUp = (e) => {
    if (dragging.current) {
      const trashEl = document.getElementById("trash-icon");
      if (trashEl && isOverTrash) onDelete(sticker.id);
      setIsOverTrash(false);
    }
    dragging.current = false;
    onDragEnd && onDragEnd();
    ref.current.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "fixed",
        left: sticker.x,
        top: sticker.y,
        zIndex: 200,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        filter: isAnyDragging ? "drop-shadow(0 5px 12px rgba(244,63,94,0.5))" : "drop-shadow(0 3px 8px rgba(124,58,237,0.35))",
        animation: "popIn 0.25s ease",
        transition: "filter 0.2s ease, transform 0.2s ease",
        transform: isOverTrash ? "scale(1.2)" : "scale(1)",
        opacity: isOverTrash ? 0.8 : 1,
      }}
    >
      <span style={{ fontSize: sticker.size || 32, lineHeight: 1, display: "block" }}>
        {sticker.emoji}
      </span>
    </div>
  );
}
