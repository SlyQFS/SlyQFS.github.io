import React, { useState, useEffect } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { MathSection } from './components/MathSection';
import { PhysicsSection } from './components/PhysicsSection';
import { RussianSection } from './components/RussianSection';
import { RoadmapSection } from './components/RoadmapSection';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('math');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] flex flex-col selection:bg-[#cba6f7] selection:text-[#11111b]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'math' && (
          <MathSection searchQuery={searchQuery} />
        )}

        {activeTab === 'physics' && (
          <PhysicsSection searchQuery={searchQuery} />
        )}

        {activeTab === 'russian' && (
          <RussianSection searchQuery={searchQuery} />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#313244]/40 bg-[#1e1e2e] py-6 text-center text-xs text-[#a6adc8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#cdd6f4]">База знаний ЕГЭ 2027</span>
            <span>·</span>
            <span>Математика, Физика, Русский язык</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>По материалам демоверсий и кодификаторов ФИПИ 2027</span>
            <span>·</span>
            <span className="text-[#cba6f7]">Material Design 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
