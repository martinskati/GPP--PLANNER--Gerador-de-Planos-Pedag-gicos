
import React, { useState } from 'react';
import { LessonPlan } from '../types';
import { 
  Printer, RefreshCw, CheckCircle2, ListChecks, Target, Presentation, 
  ClipboardCheck, Layers, HeartHandshake, User, Globe, Heart, 
  BookOpen, FilePlus, Link, Trash2, Info 
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between no-print px-2 gap-4">
        <div className="flex items-center space-x-2">
          <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-emerald-800 transition-colors text-sm font-bold group">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Novo Planejamento</span>
          </button>
        </div>

        {plans.length > 1 && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {plans.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePlanIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activePlanIndex === idx 
                    ? 'bg-white text-emerald-800 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Plano {idx + 1}
              </button>
            ))}
          </div>
        )}

        <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95">
          <Printer className="w-4 h-4" />
          <span>Imprimir Plano</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner de Identificação */}
        <div className="bg-slate-900 text-white p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                <Layers className="w-3 h-3" />
                <span>Taxonomia de Bloom • Plano {activePlanIndex + 1}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{plan.discipline}</h1>
              <div className="flex flex-col gap-1">
                <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Tema:</p>
                <p className="text-xl text-slate-300 font-medium">{plan.theme}</p>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-right backdrop-blur-sm">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Responsável</p>
              <div className="flex items-center gap-2 justify-end">
                <User className="w-4 h-4 text-emerald-400" />
                <p className="text-lg font-bold">Prof. {plan.teacherName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 space-y-12">
          {/* 1. Objetivos e Conteúdos */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Target className="w-5 h-5" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Objetivos de Aprendizagem (Bloom)</h3>
              </div>
              <ul className="space-y-3">
                {plan.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] space-y-4">
              <div className="flex items-center space-x-2 text-slate-800">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Conteúdos Programáticos</h3>
              </div>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {plan.contents}
              </p>
            </div>
          </section>

          {/* 2. Metodologia por Níveis de Bloom */}
          <section className="space-y-8">
            <div className="flex items-center space-x-3 border-b-2 border-slate-100 pb-4">
              <div className="bg-slate-900 p-2 rounded-lg shadow-sm"><Presentation className="text-white w-5 h-5" /></div>
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Metodologia: Progressão Cognitiva</h2>
            </div>
            
            <div className="grid gap-6">
              {plan.methodology.map((step, i) => (
                <div key={i} className="group flex flex-col md:flex-row gap-4 md:gap-8 bg-white border border-slate-100 hover:border-emerald-200 p-6 rounded-3xl transition-all hover:shadow-md">
                  <div className="md:w-48 shrink-0">
                    <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter mb-2 ${
                      ['Lembrar', 'Compreender'].includes(step.level) ? 'bg-blue-100 text-blue-700' :
                      ['Aplicar', 'Analisar'].includes(step.level) ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      Nível: {step.level}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo Cognitivo</p>
                    <p className="text-xs font-bold text-slate-600">{step.cognitiveObjective}</p>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {step.activity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Recursos e Avaliação */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-800">
                <Link className="w-5 h-5" />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Recursos Necessários</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-2">
                {plan.resources.map((res, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600">
                    {res}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <ClipboardCheck className="w-5 h-5" />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Avaliação (Níveis Superiores)</h2>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-sm font-bold text-emerald-900 italic">
                {plan.assessment}
              </div>
            </div>
          </section>

          {/* 4. ODS e Socioemocional (Opcionais) */}
          {(plan.ods || plan.socioemotionalSkills) && (
            <section className="grid md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
              {plan.ods && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">ODS</h4>
                    <p className="text-[11px] font-bold text-slate-600">{plan.ods.join(', ')}</p>
                  </div>
                </div>
              )}
              {plan.socioemotionalSkills && (
                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-rose-600 mt-1" />
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Socioemocional</h4>
                    <p className="text-[11px] font-bold text-slate-600">{plan.socioemotionalSkills.join(', ')}</p>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
