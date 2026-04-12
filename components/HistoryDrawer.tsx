
import React, { useState, useMemo } from 'react';
import { SavedLessonPlan } from '../types';
import { X, Trash2, Calendar, BookOpen, ChevronRight, Clock, Search, Filter, Hash, User } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedLessonPlan[];
  onSelectPlan: (plan: SavedLessonPlan) => void;
  onDeletePlan: (id: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectPlan, 
  onDeletePlan 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedHistory = useMemo(() => {
    const filtered = history.filter(p => 
      (p.theme?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (p.discipline?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.teacherName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const groups: Record<string, SavedLessonPlan[]> = {};
    filtered.forEach(plan => {
      const disc = plan.discipline || 'Outras Áreas';
      if (!groups[disc]) groups[disc] = [];
      groups[disc].push(plan);
    });
    return groups;
  }, [history, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end no-print">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                Repositório Comunitário
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Planos de Aula da Rede</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-slate-400 hover:text-emerald-900">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por conteúdo, disciplina ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 text-slate-100 mx-auto mb-4" />
              <h3 className="text-slate-900 font-bold">Nenhum plano encontrado</h3>
              <p className="text-slate-500 text-sm mt-2">Tente ajustar sua busca ou gere um novo plano.</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([discipline, plans]) => (
              <section key={discipline} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                  <Hash className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{discipline}</h3>
                  <span className="ml-auto text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 rounded-full border border-emerald-100">{plans.length}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-800/40 hover:shadow-lg transition-all group relative"
                    >
                      <div className="cursor-pointer" onClick={() => onSelectPlan(plan)}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-slate-900 font-bold text-sm group-hover:text-emerald-800 transition-colors line-clamp-1">
                            {plan.theme}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                            <User className="w-3 h-3 text-emerald-700" />
                            {plan.teacherName}
                          </div>
                          <div className="flex items-center text-[10px] text-emerald-800 font-black uppercase ml-auto">
                            Ver Detalhes <ChevronRight className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); onDeletePlan(plan.id); }}
                        className="absolute -top-2 -right-2 p-2 bg-white border border-slate-100 text-slate-300 hover:text-red-600 shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-center text-slate-400 font-bold tracking-widest uppercase">
          Plataforma de Inteligência Coletiva • Padrão BNCC
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
