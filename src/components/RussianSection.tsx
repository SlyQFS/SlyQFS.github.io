import React, { useState, useMemo } from 'react';
import {
  RUSSIAN_TASK_CHIPS,
  STRESS_WORDS,
  PARONYM_PAIRS,
  ESSAY_STRUCTURE,
  GRAMMAR_RULES,
  type StressWord,
  type ParonymItem,
  type GrammarRule
} from '../data/russianData';
import {
  Volume2,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  Info,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { TaskChipsBar } from './TaskChipsBar';

interface RussianSectionProps {
  searchQuery: string;
}

export const RussianSection: React.FC<RussianSectionProps> = ({ searchQuery }) => {
  const [selectedTask, setSelectedTask] = useState<string>('all');
  const [selectedPos, setSelectedPos] = useState<string>('Все');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Speech synthesis for stress pronunciation
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. Filtered Stress Words (№4)
  const filteredStressWords = useMemo(() => {
    return STRESS_WORDS.filter((item: StressWord) => {
      const matchesPos = selectedPos === 'Все' || item.partOfSpeech === selectedPos;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.stressedWord.toLowerCase().includes(q) ||
        (item.ruleHint && item.ruleHint.toLowerCase().includes(q));
      return matchesPos && matchesSearch;
    });
  }, [selectedPos, searchQuery]);

  // 2. Filtered Paronyms (№5)
  const filteredParonyms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PARONYM_PAIRS.filter((item: ParonymItem) => {
      if (!q) return true;
      const inTitle = item.pairTitle.toLowerCase().includes(q);
      const inWords = item.words.some(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q) ||
          w.examples.some((ex) => ex.toLowerCase().includes(q))
      );
      const inTip = item.tip ? item.tip.toLowerCase().includes(q) : false;
      return inTitle || inWords || inTip;
    });
  }, [searchQuery]);

  // 3. Filtered Grammar Rules (№8, 9, 12, 15)
  const filteredGrammarRules = useMemo(() => {
    return GRAMMAR_RULES.filter((rule: GrammarRule) => {
      const matchesTask =
        selectedTask === 'all' ||
        selectedTask === String(rule.taskNumber);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        rule.title.toLowerCase().includes(q) ||
        rule.summary.toLowerCase().includes(q) ||
        rule.rules.some(
          (r) =>
            r.heading.toLowerCase().includes(q) ||
            r.content.toLowerCase().includes(q) ||
            (r.exceptions && r.exceptions.toLowerCase().includes(q))
        );
      return matchesTask && matchesSearch;
    });
  }, [selectedTask, searchQuery]);

  const showStress = selectedTask === 'all' || selectedTask === '4';
  const showParonyms = selectedTask === 'all' || selectedTask === '5';
  const showGrammar = selectedTask === 'all' || ['8', '9', '12', '15'].includes(selectedTask);
  const showEssay = selectedTask === 'all' || selectedTask === '27';

  return (
    <div className="space-y-6">
      {/* Sequential Task Chips Filter with Smooth Wheel Scroll & Navigation Arrows */}
      <TaskChipsBar
        chips={RUSSIAN_TASK_CHIPS}
        selectedChip={selectedTask}
        onSelectChip={setSelectedTask}
        accentBg="bg-[#a6e3a1]"
      />

      {/* 1. ORTHOEPY / STRESS SECTION (№4) */}
      {showStress && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#313244]/40">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#a6e3a1]">
                Задание 4
              </span>
              <h2 className="text-lg font-bold text-[#cdd6f4]">
                Орфоэпический вопросник (Нормы ударения)
              </h2>
            </div>

            {/* Part of Speech Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['Все', 'Существительное', 'Прилагательное', 'Глагол', 'Причастие / Деепричастие', 'Наречие'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                    selectedPos === pos
                      ? 'bg-[#a6e3a1]/20 text-[#a6e3a1] font-semibold'
                      : 'bg-[#252538] text-[#a6adc8] hover:text-[#cdd6f4]'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {filteredStressWords.length === 0 ? (
            <div className="text-center py-10 bg-[#252538] rounded-2xl text-[#a6adc8] text-sm">
              Слов не найдено
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStressWords.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all flex flex-col justify-between border border-[#313244]/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-lg font-bold text-[#cdd6f4] tracking-wide">
                        {item.stressedWord}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speakWord(item.word)}
                          title="Озвучить слово"
                          className="p-1.5 rounded-full text-[#a6adc8] hover:text-[#a6e3a1] hover:bg-[#313244] transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#313244] text-[#a6adc8]">
                          {item.partOfSpeech.slice(0, 5)}
                        </span>
                      </div>
                    </div>

                    {item.ruleHint && (
                      <div className="text-xs text-[#a6adc8] bg-[#1e1e2e]/60 p-3 rounded-xl leading-relaxed flex items-start gap-2 mt-2">
                        <Lightbulb className="w-4 h-4 text-[#fab387] shrink-0 mt-0.5" />
                        <span>{item.ruleHint}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#313244]/40 flex items-center justify-between">
                    <a
                      href={item.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#89dceb] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Викисловарь</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. PARONYMS SECTION (№5) */}
      {showParonyms && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#313244]/40">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#a6e3a1]">
              Задание 5
            </span>
            <h2 className="text-lg font-bold text-[#cdd6f4]">
              Словарь паронимов и различение значений
            </h2>
          </div>

          {filteredParonyms.length === 0 ? (
            <div className="text-center py-10 bg-[#252538] rounded-2xl text-[#a6adc8] text-sm">
              Паронимов не найдено
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredParonyms.map((pair) => (
                <div
                  key={pair.id}
                  className="p-6 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all space-y-4 border border-[#313244]/40"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#313244]/40 pb-3">
                    <h3 className="text-base font-bold text-[#a6e3a1]">
                      {pair.pairTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      {pair.tip && (
                        <div className="text-xs text-[#fab387] bg-[#fab387]/15 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{pair.tip}</span>
                        </div>
                      )}
                      <a
                        href={pair.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#313244] text-[#89dceb] hover:bg-[#45475a] transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Справка</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pair.words.map((w, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#1e1e2e]/70 space-y-2">
                        <div className="font-bold text-sm text-[#cdd6f4] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#a6e3a1]" />
                          {w.name}
                        </div>
                        <p className="text-xs text-[#bac2de] leading-relaxed">
                          {w.definition}
                        </p>
                        <div className="text-[11px] text-[#a6adc8] pt-2 border-t border-[#313244]/40 space-y-0.5">
                          <span className="font-semibold text-[#a6adc8]">Примеры: </span>
                          {w.examples.map((ex, exIdx) => (
                            <span key={exIdx} className="italic text-[#cdd6f4]">
                              «{ex}»{exIdx < w.examples.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. GRAMMAR SECTION (№8, 9, 12, 15) */}
      {showGrammar && filteredGrammarRules.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#313244]/40">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#a6e3a1]">
              Орфография и синтаксис
            </span>
            <h2 className="text-lg font-bold text-[#cdd6f4]">
              Базовые правила и алгоритмы решений
            </h2>
          </div>

          <div className="space-y-5">
            {filteredGrammarRules.map((rule) => (
              <div
                key={rule.id}
                className="p-6 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all space-y-4 border border-[#313244]/40"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap border-b border-[#313244]/40 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#a6e3a1]">
                        {rule.taskTag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#cdd6f4]">{rule.title}</h3>
                    <p className="text-xs text-[#a6adc8] mt-1">{rule.summary}</p>
                  </div>

                  {rule.wikiUrl && (
                    <a
                      href={rule.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#313244] text-[#89dceb] hover:bg-[#45475a] transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{rule.wikiTitle || 'Статья в Википедии'}</span>
                    </a>
                  )}
                </div>

                <div className="space-y-3">
                  {rule.rules.map((r, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-xl bg-[#1e1e2e]/70 space-y-2">
                      <h5 className="text-xs font-bold text-[#a6e3a1]">{r.heading}</h5>
                      <p className="text-xs text-[#bac2de] leading-relaxed">{r.content}</p>
                      {r.exceptions && (
                        <div className="text-xs text-[#fab387] bg-[#fab387]/10 p-3 rounded-xl leading-relaxed flex items-start gap-2">
                          <Info className="w-4 h-4 text-[#fab387] shrink-0 mt-0.5" />
                          <span>{r.exceptions}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. ESSAY 2027 CONSTRUCTOR (№27) */}
      {showEssay && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#313244]/40">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#313244] text-[#a6e3a1]">
                Задание 27
              </span>
              <h2 className="text-lg font-bold text-[#cdd6f4]">
                Конструктор сочинения КИМ 2027 (22 первичных балла)
              </h2>
            </div>
            <a
              href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#313244] text-[#89dceb] hover:bg-[#45475a] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Официальные критерии ФИПИ</span>
            </a>
          </div>

          {/* Alert about 2027 update */}
          <div className="p-5 rounded-2xl bg-[#fab387]/15 border border-[#fab387]/30 text-xs text-[#fab387] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#fab387] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#fab387]">{ESSAY_STRUCTURE.notice}</p>
              <p className="mt-1 text-[#cdd6f4] leading-relaxed">
                В КИМ 2027 формулировка проблемы уже зафиксирована в самом тексте задания. Фокусируйтесь на четком выражении авторской позиции, 2 примерах-иллюстрациях с пояснениями, указании и детальном анализе их логической связи, а также личном обосновании.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {ESSAY_STRUCTURE.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-6 rounded-2xl bg-[#252538] hover:bg-[#28293d] transition-all space-y-3 border border-[#313244]/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#a6e3a1] text-[#11111b] font-bold flex items-center justify-center text-xs shrink-0">
                    {step.stepNumber}
                  </div>
                  <h4 className="font-bold text-[#cdd6f4] text-sm">{step.name}</h4>
                </div>

                <p className="text-xs text-[#bac2de] leading-relaxed">{step.description}</p>

                {step.warning && (
                  <div className="text-xs text-[#f38ba8] bg-[#f38ba8]/10 p-3 rounded-xl leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f38ba8] shrink-0 mt-0.5" />
                    <span>{step.warning}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#313244]/40">
                  <span className="text-[11px] font-semibold text-[#a6adc8] uppercase tracking-wider">
                    Рекомендуемые шаблоны и клише:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {step.cliches.map((cliche, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1e1e2e]/70 text-xs text-[#cdd6f4]"
                      >
                        <span className="italic pr-3">«{cliche}»</span>
                        <button
                          onClick={() => copyToClipboard(cliche)}
                          title="Скопировать клише"
                          className="p-1.5 rounded-full text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors shrink-0 cursor-pointer"
                        >
                          {copiedText === cliche ? (
                            <Check className="w-3.5 h-3.5 text-[#a6e3a1]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
