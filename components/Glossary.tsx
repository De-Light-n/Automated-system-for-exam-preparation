import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface GlossaryProps {
  items: { term: string; definition: string }[];
}

export const Glossary: React.FC<GlossaryProps> = ({ items }) => {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[650px]">
      <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-heading font-bold text-slate-800">Глосарій</h3>
            <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full">{items.length} термінів</span>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Шукати визначення..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
          />
        </div>
      </div>

      <div className="overflow-y-auto p-6 space-y-4 scroll-smooth">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <div key={idx} className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors font-heading">
                {item.term}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <p>Нічого не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
};