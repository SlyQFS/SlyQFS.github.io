import React, { useState, useEffect } from 'react';
import { STUDY_ROADMAP, type PlanMonth } from '../data/roadmapData';
import { Calendar, CheckCircle2, Circle, RotateCcw } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ege_roadmap_progress');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ege_roadmap_progress', JSON.stringify(completedTopics));
    } catch (e) {
      console.error(e);
    }
  }, [completedTopics]);

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics((prev) =>
      prev.includes(topicKey) ? prev.filter((k) => k !== topicKey) : [...prev, topicKey]
    );
  };

  // Calculate statistics
  const totalTopics = STUDY_ROADMAP.reduce(
    (acc, m) => acc + m.mathTopics.length + m.physicsTopics.length + m.russianTopics.length,
    0
  );
  const completedCount = completedTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const resetProgress = () => {
    if (confirm('Сбросить весь прогресс подготовки?')) {
      setCompletedTopics([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header Card - Material 3 Large Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#252538] border border-[#313244]/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#fab387] text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" /> Дорожная карта 2026–2027
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#cdd6f4]">
              Индивидуальный трекер подготовки к ЕГЭ 2027
            </h2>
            <p className="text-xs text-[#a6adc8] mt-1">
              Отмечайте изученные темы — прогресс сохраняется в вашем браузере автоматически.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-3xl font-black text-[#fab387]">{progressPercent}%</span>
              <p className="text-[11px] text-[#a6adc8]">
                {completedCount} из {totalTopics} тем
              </p>
            </div>
            {completedCount > 0 && (
              <button
                onClick={resetProgress}
                title="Сбросить прогресс"
                className="p-2.5 rounded-full text-[#a6adc8] hover:text-[#f38ba8] hover:bg-[#313244] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1e1e2e] rounded-full h-3 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#cba6f7] via-[#89dceb] to-[#a6e3a1] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Month-by-month timeline */}
      <div className="space-y-6">
        {STUDY_ROADMAP.map((month: PlanMonth, mIdx) => {
          return (
            <div
              key={month.id}
              className="p-6 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all space-y-5 border border-[#313244]/40"
            >
              {/* Month Header */}
              <div className="flex items-center justify-between border-b border-[#313244]/40 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#fab387]/20 text-[#fab387] font-bold flex items-center justify-center text-xs">
                    {mIdx + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#cdd6f4]">{month.monthName}</h3>
                </div>
                <span className="text-xs px-3.5 py-1 rounded-full bg-[#313244] text-[#a6adc8] font-medium tracking-wide">
                  {month.stage}
                </span>
              </div>

              {/* 3 Subject Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Math Topics */}
                <div className="p-4 rounded-xl bg-[#1e1e2e]/70 space-y-3">
                  <div className="text-xs font-bold text-[#cba6f7] uppercase tracking-wider flex items-center gap-2 border-b border-[#313244]/40 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[#cba6f7]" />
                    Профильная математика
                  </div>
                  <div className="space-y-2">
                    {month.mathTopics.map((topic, idx) => {
                      const key = `${month.id}-math-${idx}`;
                      const done = completedTopics.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleTopic(key)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                            done
                              ? 'bg-[#313244]/30 text-[#a6adc8] line-through'
                              : 'bg-[#252538] text-[#cdd6f4] hover:bg-[#313244]'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#a6e3a1] shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#a6adc8] shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Physics Topics */}
                <div className="p-4 rounded-xl bg-[#1e1e2e]/70 space-y-3">
                  <div className="text-xs font-bold text-[#89dceb] uppercase tracking-wider flex items-center gap-2 border-b border-[#313244]/40 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[#89dceb]" />
                    Физика
                  </div>
                  <div className="space-y-2">
                    {month.physicsTopics.map((topic, idx) => {
                      const key = `${month.id}-phys-${idx}`;
                      const done = completedTopics.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleTopic(key)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                            done
                              ? 'bg-[#313244]/30 text-[#a6adc8] line-through'
                              : 'bg-[#252538] text-[#cdd6f4] hover:bg-[#313244]'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#a6e3a1] shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#a6adc8] shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Russian Topics */}
                <div className="p-4 rounded-xl bg-[#1e1e2e]/70 space-y-3">
                  <div className="text-xs font-bold text-[#a6e3a1] uppercase tracking-wider flex items-center gap-2 border-b border-[#313244]/40 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[#a6e3a1]" />
                    Русский язык
                  </div>
                  <div className="space-y-2">
                    {month.russianTopics.map((topic, idx) => {
                      const key = `${month.id}-rus-${idx}`;
                      const done = completedTopics.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleTopic(key)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                            done
                              ? 'bg-[#313244]/30 text-[#a6adc8] line-through'
                              : 'bg-[#252538] text-[#cdd6f4] hover:bg-[#313244]'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#a6e3a1] shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#a6adc8] shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
