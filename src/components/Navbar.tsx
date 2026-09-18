import React from 'react';
import { Search, X } from 'lucide-react';

export type ActiveTab = 'math' | 'physics' | 'russian' | 'roadmap';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#1e1e2e]/90 backdrop-blur-md pb-2 pt-4 px-4 sm:px-8 border-b border-[#313244]/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar - on the LEFT (like Gmail/Material 3) */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#a6adc8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по заданиям, темам, формулам..."
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#313244] text-sm text-[#cdd6f4] placeholder-[#a6adc8] focus:outline-none focus:ring-2 focus:ring-[#cba6f7] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a6adc8] hover:text-[#cdd6f4] p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Tabs - Material You Rounded Pills */}
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('math')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'math'
                ? 'bg-[#cba6f7] text-[#11111b] shadow-sm font-bold'
                : 'text-[#cdd6f4] hover:bg-[#313244] bg-[#252538]'
            }`}
          >
            Профильная математика
          </button>

          <button
            onClick={() => setActiveTab('physics')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'physics'
                ? 'bg-[#89dceb] text-[#11111b] shadow-sm font-bold'
                : 'text-[#cdd6f4] hover:bg-[#313244] bg-[#252538]'
            }`}
          >
            Физика
          </button>

          <button
            onClick={() => setActiveTab('russian')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'russian'
                ? 'bg-[#a6e3a1] text-[#11111b] shadow-sm font-bold'
                : 'text-[#cdd6f4] hover:bg-[#313244] bg-[#252538]'
            }`}
          >
            Русский язык
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-[#fab387] text-[#11111b] shadow-sm font-bold'
                : 'text-[#cdd6f4] hover:bg-[#313244] bg-[#252538]'
            }`}
          >
            План подготовки
          </button>
        </nav>
      </div>
    </header>
  );
};
