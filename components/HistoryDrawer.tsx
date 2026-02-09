
import React from 'react';
import { SavedLessonPlan } from '../types';
import { X, Trash2, Calendar, BookOpen, ChevronRight, Clock } from 'lucide-react';

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
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end no-print">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-slate-950 h-full border-l border-orange-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Banco de Planos
            </h2>
            <p className="text-xs text-slate-400 mt-1">Seu histórico de produções</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="bg-slate-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Clock className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-slate-300 font-medium">Nenhum plano salvo</h3>
              <p className="text-slate-500 text-sm mt-2">
                Os planos gerados aparecerão automaticamente aqui para consulta futura.
              </p>
            </div>
          ) : (
            history.map((plan) => (
              <div 
                key={plan.id}
                className="bg-black border border-white/10 rounded-xl p-4 hover:border-orange-500/50 transition-all group relative overflow-hidden"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectPlan(plan)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20 truncate max-w-[150px]">
                      {plan.discipline}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {formatDate(plan.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-slate-200 font-semibold text-sm line-clamp-2 mb-2 group-hover:text-white transition-colors">
                    {plan.content}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {plan.methodology}
                  </p>

                  <div className="flex items-center text-xs text-orange-400 font-medium">
                    Ver plano completo <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePlan(plan.id);
                  }}
                  className="absolute bottom-3 right-3 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors z-10"
                  title="Excluir do histórico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-4 bg-black border-t border-white/10 text-[10px] text-center text-slate-600">
          Armazenamento local seguro no seu dispositivo.
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
