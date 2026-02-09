
import React from 'react';
import { LessonPlan } from '../types';
import { Printer, RefreshCw, CheckCircle2, ListChecks, Target, Presentation, ClipboardCheck, ArrowRight, Layers, ScrollText, HeartHandshake } from 'lucide-react';

interface PlanResultProps {
  plan: LessonPlan;
  onReset: () => void;
}

const PlanResult: React.FC<PlanResultProps> = ({ plan, onReset }) => {
  const handlePrint = () => window.print();

  // Helper para garantir que renderizamos string mesmo se vier array de dados antigos
  const renderTextContent = (content: string | string[]) => {
    if (Array.isArray(content)) return content.join(', ');
    return content;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Barra de Ações Superior */}
      <div className="flex items-center justify-between no-print px-2">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-slate-400 hover:text-orange-400 transition-colors text-sm font-semibold group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Criar Outra Versão</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-black hover:bg-slate-900 border border-orange-500 text-orange-500 hover:text-orange-400 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir para Diário</span>
        </button>
      </div>

      <div className="bg-black rounded-[2.5rem] shadow-2xl border border-orange-500/30 overflow-hidden relative">
        
        {/* Cabeçalho do Plano */}
        <div className="bg-gradient-to-r from-black to-slate-900 border-b border-orange-500/20 text-white p-10 md:p-14 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-orange-500/30">
                <Layers className="w-3.5 h-3.5" />
                <span>Padrão BNCC Qualificado</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">{plan.discipline}</h1>
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-12 h-[1px] bg-orange-500"></div>
                <p className="text-xl font-medium text-slate-200">{plan.content}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hidden md:block text-right">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Modelo Pedagógico</p>
              <p className="text-lg font-bold text-white">Proposta Editável</p>
            </div>
          </div>
        </div>

        {/* Corpo do Plano - Preto e Laranja */}
        <div className="p-8 md:p-14 space-y-16 bg-black text-slate-300">
          
          {/* Seção 1: Metodologia de Ensino */}
          <section className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/50">
                <Presentation className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase text-sm">▸ Metodologia de Ensino</h2>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Presentation className="w-24 h-24 text-orange-500" />
              </div>
              <p className="text-slate-200 leading-relaxed font-semibold text-lg relative z-10">
                {plan.methodology}
              </p>
            </div>
          </section>

          {/* OBS: A seção de Habilidades foi removida visualmente, mas os dados persistem no objeto plan */}

          {/* Seção 2: Objetivos de Aprendizagem */}
          <section>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/50">
                <Target className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase text-sm">▸ Objetivos de Aprendizagem (Bloom)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start space-x-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 group hover:border-orange-500 transition-all duration-300">
                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="text-slate-300 font-medium text-sm leading-relaxed group-hover:text-white transition-colors">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção 3: Sequência Didática */}
          <section className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/50">
                <ListChecks className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase text-sm">▸ Sequência Didática</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-2">
                  <span className="text-orange-500 font-black text-lg">•</span>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">O que será feito na aula?</h3>
                </div>
                <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-slate-800 shadow-sm hover:border-orange-500/30 transition-colors h-full">
                  <div className="prose prose-invert prose-slate text-sm leading-relaxed whitespace-pre-line font-medium text-slate-300 text-justify">
                    {plan.development.what}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-2">
                  <span className="text-white font-black text-lg">•</span>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Como será feito na sala de aula?</h3>
                </div>
                <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-slate-800 shadow-sm hover:border-orange-500/30 transition-colors h-full">
                  <div className="prose prose-invert prose-slate text-sm leading-relaxed whitespace-pre-line font-medium text-slate-300 text-justify">
                    {plan.development.how}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção Nova: Estratégias de Inclusão e Acessibilidade */}
          {plan.inclusionStrategies && (
            <section className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/50">
                  <HeartHandshake className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase text-sm">▸ Estratégias de Inclusão e Acessibilidade</h2>
              </div>
              <div className="bg-indigo-950/20 p-8 rounded-[2rem] border border-indigo-500/30 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HeartHandshake className="w-24 h-24 text-indigo-500" />
                </div>
                <p className="text-indigo-100 leading-relaxed font-semibold text-lg relative z-10 text-justify">
                  {renderTextContent(plan.inclusionStrategies)}
                </p>
              </div>
            </section>
          )}

          {/* Seção 4: Avaliação e Evidências */}
          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-slate-800">
            {/* Evidências */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/50">
                  <CheckCircle2 className="text-white w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight text-sm">▸ Evidências de Aprendizagem</h2>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/30 transition-colors">
                <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-line text-justify">
                  {renderTextContent(plan.learningEvidence)}
                </p>
              </div>
            </section>

            {/* Instrumentos */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/50">
                  <ClipboardCheck className="text-white w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight text-sm">▸ Instrumentos de Avaliação</h2>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/30 transition-colors">
                 <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-line text-justify">
                  {renderTextContent(plan.assessmentInstruments)}
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Rodapé do Cartão */}
        <div className="bg-slate-900 p-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Planejamento Estratégico Docente</p>
          </div>
          <p className="text-xs text-slate-400 font-bold italic bg-black px-4 py-2 rounded-full border border-slate-800">
            "Este plano sistematiza sua autoria para uma prática pedagógica de excelência."
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
