import React, { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export interface ChipItem {
  label: string;
  value: string;
}

interface TaskChipsBarProps {
  chips: ChipItem[];
  selectedChip: string;
  onSelectChip: (value: string) => void;
  accentBg: string;
}

export const TaskChipsBar: React.FC<TaskChipsBarProps> = ({
  chips,
  selectedChip,
  onSelectChip,
  accentBg,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Horizontal mouse wheel scroll (converts vertical wheel deltaY to horizontal scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setInitialScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    containerRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleChipClick = (val: string) => {
    if (!hasMoved) {
      onSelectChip(val);
    }
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex items-center gap-2 overflow-x-auto pb-2.5 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {chips.map((chip) => {
          const isSelected = selectedChip === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleChipClick(chip.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? `${accentBg} text-[#11111b] shadow-sm font-bold`
                  : 'bg-[#252538] text-[#cdd6f4] hover:bg-[#313244]'
              }`}
            >
              {chip.label.includes('Новое') && <Sparkles className="w-3.5 h-3.5" />}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
