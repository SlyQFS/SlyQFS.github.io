import React, { useState, useMemo } from 'react';
import { MATH_TASK_CHIPS, MATH_FORMULAS, type FormulaItem } from '../data/mathData';
import { KaTeXRenderer } from './KaTeXRenderer';
import { Search, Copy, Check, Sparkles, ExternalLink, Lightbulb } from 'lucide-react';

import { TaskChipsBar } from './TaskChipsBar';

interface MathSectionProps {
  searchQuery: string;
}

export const MathSection: React.FC<MathSectionProps> = ({ searchQuery }) => {
  const [selectedChip, setSelectedChip] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFormulas = useMemo(() => {
    return MATH_FORMULAS.filter((item) => {
      // Task filter match
      let matchesFilter = true;
      if (selectedChip === 'part1') {
        matchesFilter = item.part === 1;
      } else if (selectedChip === 'part2') {
        matchesFilter = item.part === 2;
      } else if (selectedChip !== 'all') {
        matchesFilter = item.taskNumber === Number(selectedChip);
      }

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.taskTag.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.explanation && item.explanation.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query) ||
        item.formula.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    }).sort((a, b) => a.taskNumber - b.taskNumber);
  }, [selectedChip, searchQuery]);

  const copyFormula = (item: FormulaItem) => {
    navigator.clipboard.writeText(item.formula);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Task Filter Chips with Smooth Wheel Scroll & Navigation Arrows */}
      <TaskChipsBar
        chips={MATH_TASK_CHIPS}
        selectedChip={selectedChip}
        onSelectChip={setSelectedChip}
        accentBg="bg-[#cba6f7]"
      />

      {/* Grid of Formulas */}
      {filteredFormulas.length === 0 ? (
        <div className="text-center py-16 bg-[#252538] rounded-3xl p-8 border border-[#313244]/40">
          <Search className="w-10 h-10 text-[#a6adc8] mx-auto mb-3" />
          <p className="text-[#cdd6f4] font-medium">Ничего не найдено</p>
          <p className="text-[#a6adc8] text-sm mt-1">Попробуйте изменить номер задания или поисковый запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFormulas.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all duration-200 border border-[#313244]/40"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#cba6f7]">
                        {item.taskTag}
                      </span>
                      {item.isNew2027 && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#fab387]/20 text-[#fab387] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> КИМ 2027
                        </span>
                      )}
                      <span className="text-xs text-[#a6adc8] font-medium tracking-wide">
                        {item.category}
                      </span>
                    </div>

                    {/* Copy LaTeX button */}
                    <button
                      onClick={() => copyFormula(item)}
                      title="Копировать формулу (LaTeX)"
                      className="p-2 rounded-full text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-[#a6e3a1]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-[#cdd6f4] mb-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Formula Body */}
                <div className="my-3 py-4 px-5 rounded-2xl bg-[#1e1e2e]/90 text-center flex items-center justify-center overflow-x-auto">
                  <KaTeXRenderer math={item.formula} block />
                </div>

                {/* Description & Reference link */}
                <div className="space-y-3 text-xs text-[#bac2de] mt-2">
                  <p className="leading-relaxed">{item.description}</p>
                  {item.explanation && (
                    <div className="text-[#a6adc8] bg-[#1e1e2e]/50 p-3 rounded-xl leading-relaxed flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#fab387] shrink-0 mt-0.5" />
                      <span>{item.explanation}</span>
                    </div>
                  )}

                  {/* External Reference Link */}
                  {item.wikiUrl && (
                    <div className="pt-2 border-t border-[#313244]/40 flex items-center justify-between">
                      <a
                        href={item.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#313244] text-[#89dceb] hover:bg-[#45475a] transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{item.wikiTitle || 'Статья в Википедии'}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
