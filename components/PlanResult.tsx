
import React, { useState } from 'react';
import { LessonPlan } from '../types';
import { 
  Printer, RefreshCw, CheckCircle2, ListChecks, Target, Presentation, 
  ClipboardCheck, Layers, HeartHandshake, User, Globe, Heart, 
  BookOpen, FilePlus, Link, Trash2, Info, ClipboardList, BrainCircuit, Users 
} from 'lucide-react';

interface PlanResultProps {
  plans: LessonPlan[];
  onReset: () => void;
}

const PlanResult: React.FC<PlanResultProps> = ({ plans, onReset }) => {
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const plan = plans[activePlanIndex];

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Controles Superiores */}
      <div className="flex flex-col md:flex-row items-center justify-between no-print gap-4">
        <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-emerald-800 transition-colors text-sm font-bold">
          <RefreshCw className="w-4 h-4" />
          <span>Novo Planejamento</span>
        </button>

        {plans.length > 1 && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {plans.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePlanIndex(idx)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  activePlanIndex === idx 
                    ? 'bg-white text-emerald-800 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Opção {idx + 1}
              </button>
            ))}
          </div>
        )}

        <button onClick={handlePrint} className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-md">
          <Printer className="w-4 h-4" />
          <span>Imprimir</span>
        </button>
      </div>

      {/* Documento do Plano */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* 1. Cabeçalho (topo da página) */}
        <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Conteúdo da Aula</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{plan.theme}</h1>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{plan.discipline}</p>
            </div>
            <div className="text-center md:text-right bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Professor(a)</p>
              <p className="text-xl font-black text-emerald-800">Prof. {plan.teacherName}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          
          {/* 2. Seção intermediária (ODS e DUA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 border-2 border-blue-100 p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4" /> Quadro 1: ODS
              </h3>
              <p className="text-sm text-blue-900/80 font-semibold leading-relaxed">
                {plan.ods && plan.ods.length > 0 ? plan.ods.join(', ') : 'Não especificado'}
              </p>
            </div>
            <div className="bg-purple-50/50 border-2 border-purple-100 p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-black text-purple-800 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Quadro 2: DUA
              </h3>
              <p className="text-sm text-purple-900/80 font-semibold leading-relaxed">
                {plan.dua || plan.inclusionProposal}
              </p>
            </div>
          </div>

          {/* 3. Seção de planejamento (lado a lado) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quadro Esquerdo: Planejamento */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Planejamento da Aula</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Tema</h4>
                  <p className="text-sm font-bold text-slate-700">{plan.theme}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Metodologia</h4>
                  <p className="text-sm font-bold text-slate-700">{plan.suggestedMethodology}</p>
                  <div className="mt-2 space-y-3">
                    {plan.methodology.map((step, i) => (
                      <div key={i} className="text-xs border-l-2 border-emerald-200 pl-3 py-1">
                        <span className="font-black text-emerald-800 uppercase text-[9px]">{step.level}:</span> {step.activity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">O que será feito em aula</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{plan.whatWillBeDone}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Como será feita a aula</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{plan.howItWillBeDone}</p>
                </div>
              </div>
            </div>

            {/* Quadro Direito: Avaliação */}
            <div className="bg-emerald-50/30 border border-emerald-100 p-8 rounded-3xl space-y-8">
              <div className="border-b border-emerald-100 pb-4">
                <h2 className="text-sm font-black text-emerald-900 uppercase tracking-[0.2em]">Avaliação</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Evidências de Aprendizagem</h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{plan.learningEvidence}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Instrumentos de Avaliação</h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{plan.assessmentInstruments}</p>
                </div>

                <div className="pt-4 space-y-2">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Objetivos (Bloom)</h4>
                  <ul className="space-y-2">
                    {plan.objectives.map((obj, i) => (
                      <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" /> {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Seção final: Dicas de propostas de atividades */}
          <section className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 flex items-center gap-3">
                <Presentation className="w-6 h-6" /> Dicas de propostas de atividades
              </h3>
              <div className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                {plan.activityTips}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PlanResult;
