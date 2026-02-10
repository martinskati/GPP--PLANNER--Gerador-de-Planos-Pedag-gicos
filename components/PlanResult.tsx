
import React from 'react';
import { LessonPlan } from '../types';
import { Printer, RefreshCw, CheckCircle2, ListChecks, Target, Presentation, ClipboardCheck, Layers, HeartHandshake, User, Globe, Heart } from 'lucide-react';

interface PlanResultProps {
  plan: LessonPlan;
  onReset: () => void;
}

const PlanResult: React.FC<PlanResultProps> = ({ plan, onReset }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between no-print px-2">
        <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-emerald-800 transition-colors text-sm font-bold group">
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Criar Outra Versão</span>
        </button>
        <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95">
          <Printer className="w-4 h-4" />
          <span>Imprimir para Diário</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 p-10 md:p-14 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-emerald-200">
                <Layers className="w-3.5 h-3.5" />
                <span>Padrão BNCC Qualificado</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">{plan.discipline}</h1>
              <p className="text-xl font-bold text-slate-700">{plan.content}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hidden md:block text-right">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Documento Técnico</p>
              <p className="text-lg font-bold text-slate-800">Modelo Pedagógico</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 space-y-12 bg-white text-slate-600">
          
          {/* Nova Seção: ODS e Socioemocional */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[2rem]">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="text-blue-800 w-5 h-5" />
                <h3 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Impacto Social (ODS)</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.ods?.map((item, i) => (
                  <span key={i} className="bg-white border border-blue-200 px-3 py-1 rounded-full text-[11px] font-bold text-blue-900 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem]">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="text-rose-800 w-5 h-5" />
                <h3 className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Socioemocional</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.socioemotionalSkills?.map((item, i) => (
                  <span key={i} className="bg-white border border-rose-200 px-3 py-1 rounded-full text-[11px] font-bold text-rose-900 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-800 p-2.5 rounded-xl shadow-lg"><Presentation className="text-white w-6 h-6" /></div>
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Metodologia de Ensino</h2>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
              <p className="text-slate-800 leading-relaxed font-bold text-lg italic">{plan.methodology}</p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-emerald-800 p-2.5 rounded-xl shadow-lg"><Target className="text-white w-6 h-6" /></div>
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Objetivos de Aprendizagem (Bloom)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                  <span className="text-slate-700 font-bold text-sm">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-800 p-2.5 rounded-xl shadow-lg"><ListChecks className="text-white w-6 h-6" /></div>
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Sequência Didática</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-2 italic mb-2">O que será feito na aula</h3>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 text-sm font-semibold">{plan.development.what}</div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-2 italic mb-2">Como será feito a aula</h3>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 text-sm font-semibold">{plan.development.how}</div>
              </div>
            </div>
          </section>

          {plan.inclusionStrategies && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-emerald-900 p-2.5 rounded-xl shadow-lg"><HeartHandshake className="text-white w-6 h-6" /></div>
                <h2 className="text-xs font-black text-emerald-800 tracking-widest uppercase">▸ Estratégias de Inclusão e DUA</h2>
              </div>
              <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                <p className="text-emerald-900 font-bold text-lg italic">{plan.inclusionStrategies}</p>
              </div>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
            <section className="space-y-4">
              <div className="flex items-center space-x-2"><CheckCircle2 className="text-emerald-800 w-5 h-5" /><h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidências de Aprendizagem</h2></div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm font-bold">{plan.learningEvidence}</div>
            </section>
            <section className="space-y-4">
              <div className="flex items-center space-x-2"><ClipboardCheck className="text-emerald-800 w-5 h-5" /><h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instrumentos de Avaliação</h2></div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm font-bold">{plan.assessmentInstruments}</div>
            </section>
          </div>

          <section className="pt-12 mt-12 border-t-2 border-slate-50 flex flex-col items-center justify-center">
            <div className="w-64 h-[1px] bg-slate-300 mb-2"></div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg"><User className="w-5 h-5 text-emerald-800" /><span>Prof. {plan.teacherName}</span></div>
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mt-1">Autor da Proposta Pedagógica</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
