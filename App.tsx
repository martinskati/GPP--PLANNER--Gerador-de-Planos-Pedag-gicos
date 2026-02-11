
import React, { useState, useCallback, useEffect } from 'react';
import { generateLessonPlan } from './services/geminiService';
import { storageService } from './services/storageService';
import { LessonPlan, AppState, SavedLessonPlan } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import PlanResult from './components/PlanResult';
import HistoryDrawer from './components/HistoryDrawer';
import { BookOpen, Send, Loader2, Info, MessageSquare, Star, CheckCircle, ClipboardList, AlertCircle, User, Globe, Heart, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
  const [state, setState] = useState<AppState>({
    isGenerating: false,
    plan: null,
    error: null,
    showHistory: false
  });
  const [history, setHistory] = useState<SavedLessonPlan[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação proativa com feedback visual
    if (!teacherName.trim()) {
      setState(prev => ({ ...prev, error: "Por favor, insira seu nome antes de gerar o plano." }));
      return;
    }
    if (!inputText.trim()) {
      setState(prev => ({ ...prev, error: "O detalhamento do plano não pode estar vazio." }));
      return;
    }

    console.log("Iniciando geração de plano para:", teacherName);
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    const fullInput = `Nome do Professor: ${teacherName}\n${inputText}`;
    
    try {
      const generatedPlan = await generateLessonPlan(fullInput);
      storageService.savePlan(generatedPlan);
      setHistory(storageService.getHistory());

      setState({
        isGenerating: false,
        plan: generatedPlan,
        error: null,
        showHistory: false
      });
    } catch (err: any) {
      console.error("Erro na submissão do formulário:", err);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Falha na comunicação com a IA. Verifique sua chave de API."
      }));
    }
  }, [inputText, teacherName]);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackStatus('sending');
    setTimeout(() => {
      setFeedbackStatus('success');
      setFeedbackText('');
      setTimeout(() => setFeedbackStatus('idle'), 5000);
    }, 1500);
  };

  const handleReset = () => {
    setState({ isGenerating: false, plan: null, error: null, showHistory: false });
    setInputText('');
    setTeacherName('');
  };

  const handleSelectHistoryPlan = (savedPlan: SavedLessonPlan) => {
    setState(prev => ({ ...prev, plan: savedPlan, showHistory: false, error: null }));
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Excluir este plano do histórico?')) {
      const updated = storageService.deletePlan(id);
      setHistory(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 relative bg-slate-50">
      <Header onOpenHistory={() => setState(prev => ({ ...prev, showHistory: true }))} />
      
      <HistoryDrawer 
        isOpen={state.showHistory}
        onClose={() => setState(prev => ({ ...prev, showHistory: false }))}
        history={history}
        onSelectPlan={handleSelectHistoryPlan}
        onDeletePlan={handleDeletePlan}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {!state.plan ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Alerta de Erro - Agora mais visível */}
            {state.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3 text-red-800 animate-bounce-short">
                <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
                <div className="flex-grow">
                  <p className="text-sm font-black uppercase tracking-tight">Atenção Professor:</p>
                  <p className="text-sm opacity-90">{state.error}</p>
                </div>
                <button 
                  onClick={() => setState(p => ({...p, error: null}))}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <ClipboardList className="text-emerald-800 w-6 h-6" />
                <h2 className="text-lg font-bold text-emerald-900">Guia de Sistematização</h2>
              </div>
              <p className="text-sm text-emerald-800/80 mb-6 font-medium">Certifique-se de preencher os campos abaixo para um plano perfeito:</p>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                {[
                  { id: 1, label: "Conteúdo", desc: "Assunto principal da aula." },
                  { id: 2, label: "Verbo BNCC", desc: "Ação que o aluno deve realizar." },
                  { id: 3, label: "Turma", desc: "Série e quantidade de alunos." },
                  { id: 4, label: "Inclusão", desc: "Necessidades especiais do grupo." }
                ].map(item => (
                  <div key={item.id} className="bg-white/60 p-3 rounded-xl border border-emerald-200/50 flex items-start space-x-3">
                    <div className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-0.5">{item.id}</div>
                    <div><span className="font-bold text-emerald-900 block">{item.label}</span>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Nome Completo do Professor
                  </label>
                  <input
                    type="text" 
                    value={teacherName} 
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Sua assinatura no documento final..."
                    className={`w-full p-4 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-emerald-800 outline-none text-sm font-semibold transition-all ${state.error && !teacherName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    disabled={state.isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5" /> Detalhamento do Plano
                  </label>
                  <textarea
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Exemplo:\nConteúdo: Sujeito e Predicado\nVerbo base: Identificar (BNCC)\nTurma: 1º Ano Ensino Médio\nPerfil: 30 alunos, com 1 aluno TEA.`}
                    className={`w-full h-64 p-5 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-emerald-800 outline-none resize-none text-sm font-medium transition-all ${state.error && !inputText ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    disabled={state.isGenerating}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 mr-2 text-emerald-700" /> Diretrizes SESI/BNCC, ODS e Socioemocional
                  </div>
                  <button
                    type="submit" 
                    disabled={state.isGenerating}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                  >
                    {state.isGenerating ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Sistematizando...</span></>
                    ) : (
                      <><Send className="w-5 h-5" /><span>Gerar Plano Qualificado</span></>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Banco de Dados', desc: 'Arquivo automático para consulta futura.' },
                { title: 'Taxonomia Bloom', desc: 'Verbos rigorosamente alinhados.' },
                { title: 'Foco na Inclusão', desc: 'Estratégias de DUA personalizadas.' },
                { title: 'ODS & Socioemocional', desc: 'Alinhamento com a Agenda 2030.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all group">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-emerald-800">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <PlanResult plan={state.plan} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
