import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Wind, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { BreathingDetailModal } from '../components/modals/BreathingDetailModal';

export function BreathingPatternLibraryPage() {
  const navigate = useNavigate();

  const [techniques, setTechniques] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTechniques();
  }, []);

  const loadTechniques = async () => {
    setIsLoading(true);
    const data = await api.getQuickPractices();
    if (data && (data.libraryItems || data.all)) {
      const items = data.libraryItems && data.libraryItems.length > 0 
        ? data.libraryItems 
        : (data.all || []).filter(i => i.category === 'library' || i.category === 'sos_moment');
      setTechniques(items);
    }
    setIsLoading(false);
  };

  // Filtered list by category pill and search query
  const filteredTechniques = techniques.filter((item) => {
    const matchesFilter = selectedFilter === 'All' || item.filterCategory === selectedFilter || item.category === selectedFilter.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleStartSync = (technique) => {
    setActiveModalItem(null);
    navigate('/quick-practice-timer', { state: { practice: technique } });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto pb-12 select-none">
      {/* HEADER BAR matching Image 2 */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-stone-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif">
          Breathing Pattern Library
        </h1>
      </div>

      {/* SEARCH BAR matching Image 2 */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search Pranayama & breath pattern..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-sans text-slate-900 dark:text-amber-50 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#4A5D37]"
        />
      </div>

      {/* CATEGORY PILL FILTERS matching Image 2 */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 font-sans">
        {['All', 'Calm', 'Focus', 'Sleep', 'Energy'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedFilter === cat
                ? 'bg-[#4A5D37] text-white border-[#4A5D37] shadow-sm'
                : 'bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRANAYAMA TECHNIQUE CARDS LIST matching Image 2 */}
      <div className="space-y-4">
        {filteredTechniques.map((item) => (
          <div
            key={item._id || item.id}
            onClick={() => setActiveModalItem(item)}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-[#4A5D37]/50 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF0E5] dark:bg-emerald-950 text-[#4A5D37] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Wind className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-amber-50">
                  {item.title}
                </h3>
                <p className="text-xs font-serif text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#EBF2E4] dark:bg-emerald-950/60 text-[#3B4D2B] dark:text-emerald-300 text-[11px] font-sans font-extrabold">
                    {item.patternTag || 'Pattern: 4-4-4-4'}
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* DETAIL & BENEFITS MODAL matching Image 3 */}
      <BreathingDetailModal
        isOpen={Boolean(activeModalItem)}
        onClose={() => setActiveModalItem(null)}
        technique={activeModalItem}
        onStartSync={handleStartSync}
      />
    </div>
  );
}
