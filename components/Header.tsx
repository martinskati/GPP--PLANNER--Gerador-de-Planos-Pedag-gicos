
import React from 'react';
import { GraduationCap, History } from 'lucide-react';

interface HeaderProps {
  onOpenHistory?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
  return (
    <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Logo Azul e Branco conforme solicitado */}
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 leading-none">Assistente Pedagógico</h1>
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest">Institucional</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenHistory}
            className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">Histórico de Planos</span>
          </button>

          <nav className="hidden md:flex items-center space-x-4">
            <div className="h-4 w-[1px] bg-white/10"></div>
            <span className="text-sm text-slate-400 font-medium">Padrão BNCC</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
