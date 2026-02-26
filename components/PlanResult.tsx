
import React, { useState } from 'react';
import { LessonPlan } from '../types';
import { 
  Printer, RefreshCw, CheckCircle2, ListChecks, Target, Presentation, 
  ClipboardCheck, Layers, HeartHandshake, User, Globe, Heart, 
  BookOpen, FilePlus, Link, Trash2, Info 
} from 'lucide-react';

interface PlanResultProps {
  plan: LessonPlan;
  onReset: () => void;
}

const PlanResult: React.FC<PlanResultProps> = ({ plan, onReset }) => {
  const [materials, setMaterials] = useState<string[]>(plan.supportMaterials || []);
  const [newMaterial, setNewMaterial] = useState('');

  const handlePrint = () => window.print();

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, newMaterial.trim()]);
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between no-print px-2">
        <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-emerald-800 transition-colors text-sm font-bold group">
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Novo Planejamento</span>
        </button>
        <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95">
          <Printer className="w-4 h-4" />
          <span>Imprimir Plano SESI</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner de Identificação SESI */}
        <div className="bg-slate-900 text-white p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                <Layers className="w-3 h-3" />
                <span>Documentação Pedagógica Oficial</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{plan.discipline}</h1>
              <div className="flex flex-col gap-1">
                <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Conteúdo:</p>
                <p className="text-xl text-slate-300 font-medium">{plan.content}</p>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-right backdrop-blur-sm">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Assinatura</p>
              <div className="flex items-center gap-2 justify-end">
                <User className="w-4 h-4 text-emerald-400" />
                <p className="text-lg font-bold">Prof. {plan.teacherName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 space-y-12">
          {/* 1. Apresentação Inicial: ODS, Socioemocional, DUA */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
              <div className="flex items-center space-x-2 mb-4 text-blue-800">
                <Globe className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">ODS Relacionadas</h3>
              </div>
              <ul className="space-y-2">
                {plan.ods.map((ods, i) => (
                  <li key={i} className="bg-white/60 p-2 rounded-lg text-[11px] font-bold text-blue-900 border border-blue-200/50">
                    {ods}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
              <div className="flex items-center space-x-2 mb-4 text-rose-800">
                <Heart className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Socioemocional</h3>
              </div>
              <ul className="space-y-2">
                {plan.socioemotionalSkills.map((skill, i) => (
                  <li key={i} className="bg-white/60 p-2 rounded-lg text-[11px] font-bold text-rose-900 border border-rose-200/50">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
              <div className="flex items-center space-x-2 mb-4 text-emerald-800">
                <HeartHandshake className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Estratégias de Inclusão (DUA)</h3>
              </div>
              <p className="text-[11px] font-bold text-emerald-900 leading-relaxed italic">
                {plan.inclusionStrategies}
              </p>
            </div>
          </section>

          {/* 2 & 3. Metodologia e Objeto do Conhecimento */}
          <section className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-lg shadow-sm"><Presentation className="text-white w-5 h-5" /></div>
                <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Metodologia Estratégica</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="text-slate-900 font-bold">{plan.methodology}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-lg shadow-sm"><Info className="text-white w-5 h-5" /></div>
                <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Objeto do Conhecimento</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="text-slate-900 font-bold">{plan.objectOfKnowledge}</p>
              </div>
            </div>
          </section>

          {/* 4. Desenvolvimento (O que / Como) */}
          <section className="space-y-8">
            <div className="flex items-center space-x-3 border-b-2 border-slate-100 pb-4">
              <div className="bg-emerald-800 p-2 rounded-lg shadow-sm"><ListChecks className="text-white w-5 h-5" /></div>
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Desenvolvimento do Plano (Padrão SESI)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div> O que será feito em aula?
                </label>
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 text-sm font-semibold leading-relaxed shadow-inner">
                  {plan.development.what}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Como será feito?
                </label>
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 text-sm font-semibold leading-relaxed shadow-inner">
                  {plan.development.how}
                </div>
              </div>
            </div>
          </section>

          {/* 5 & 6. Evidências e Instrumentos */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Evidências de Aprendizagem</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-[13px] font-bold">
                {plan.learningEvidence}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <ClipboardCheck className="w-5 h-5" />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Instrumentos de Avaliação</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-[13px] font-bold">
                {plan.assessmentInstruments}
              </div>
            </div>
          </section>

          {/* 7. Espaço para Materiais de Apoio (Interativo) */}
          <section className="bg-slate-50 rounded-[2rem] p-8 md:p-12 space-y-6 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-lg shadow-sm"><FilePlus className="text-white w-5 h-5" /></div>
                <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase">▸ Materiais de Apoio</h2>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Espaço para anexos e referências</div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-grow">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Cole aqui links de slides, PDFs ou imagens..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && addMaterial()}
                />
              </div>
              <button 
                onClick={addMaterial}
                className="bg-emerald-800 text-white px-6 rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-95 shadow-md"
              >
                Adicionar
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {materials.length === 0 ? (
                <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm italic">
                  Nenhum material adicionado. Use este espaço para anexar seus recursos didáticos.
                </div>
              ) : (
                materials.map((m, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <BookOpen className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="text-xs font-bold text-slate-600 truncate">{m}</span>
                    </div>
                    <button 
                      onClick={() => removeMaterial(i)}
                      className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Versão Impressa dos Materiais */}
          <section className="print-only pt-8 border-t border-slate-100">
             <h2 className="text-[10px] font-black uppercase tracking-widest mb-4">▸ Materiais de Apoio Adicionados</h2>
             <ul className="list-disc pl-5 text-sm space-y-1">
               {materials.map((m, i) => <li key={i} className="text-slate-600 font-medium">{m}</li>)}
               {materials.length === 0 && <li className="text-slate-400 italic">Nenhum material de apoio anexado.</li>}
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
