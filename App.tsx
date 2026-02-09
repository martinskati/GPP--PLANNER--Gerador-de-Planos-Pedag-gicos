
import React, { useState, useCallback, useEffect } from 'react';
import { generateLessonPlan } from './services/geminiService';
import { storageService } from './services/storageService';
import { LessonPlan, AppState, SavedLessonPlan } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import PlanResult from './components/PlanResult';
import HistoryDrawer from './components/HistoryDrawer';
import { BookOpen, Send, Loader2, Info, MessageSquare, Star, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
  const [state, setState] = useState<AppState>({
    isGenerating: false,
    plan: null,
    error: null,
    showHistory: false
  });
  const [history, setHistory] = useState<SavedLessonPlan[]>([]);

  // Carrega histórico inicial
  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  // Força recarregamento do histórico sempre que a aba for aberta
  useEffect(() => {
    if (state.showHistory) {
      setHistory(storageService.getHistory());
    }
  }, [state.showHistory]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const generatedPlan = await generateLessonPlan(inputText);
      storageService.savePlan(generatedPlan);
      setHistory(storageService.getHistory());

      setState({
        isGenerating: false,
        plan: generatedPlan,
        error: null,
        showHistory: false
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Ocorreu um erro inesperado."
      }));
    }
  }, [inputText]);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setFeedbackStatus('sending');
    // Simula envio para um servidor/banco de dados
    setTimeout(() => {
      setFeedbackStatus('success');
      setFeedbackText('');
      setTimeout(() => setFeedbackStatus('idle'), 5000);
    }, 1500);
  };

  const handleReset = () => {
    setState({ isGenerating: false, plan: null, error: null, showHistory: false });
    setInputText('');
  };

  const handleSelectHistoryPlan = (savedPlan: SavedLessonPlan) => {
    setState(prev => ({
      ...prev,
      plan: savedPlan,
      showHistory: false,
      error: null
    }));
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano do histórico?')) {
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
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Card Principal */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-start space-x-4 mb-6 relative z-10">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <BookOpen className="text-emerald-800 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Nova Proposta Pedagógica</h2>
                  <p className="text-slate-500 mt-1">
                    Descreva sua ideia para a aula. O plano será qualificado e 
                    <span className="text-emerald-800 font-bold"> arquivado no seu banco de dados.</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ex: Gostaria de uma aula de história sobre a Revolução Industrial para o 8º ano..."
                  className="w-full h-48 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all outline-none resize-none text-slate-800 placeholder-slate-400 leading-relaxed"
                  disabled={state.isGenerating}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-400">
                    <Info className="w-4 h-4 mr-1 text-emerald-700" />
                    Sua autoria intelectual será integralmente preservada.
                  </div>
                  <button
                    type="submit"
                    disabled={state.isGenerating || !inputText.trim()}
                    className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                  >
                    {state.isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Qualificando e Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gerar e Salvar Plano</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center">
                <span className="font-bold">Erro:</span>
                <span className="ml-2">{state.error}</span>
              </div>
            )}

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Banco de Planos', desc: 'Todo plano gerado é arquivado automaticamente no seu histórico.' },
                { title: 'Taxonomia de Bloom', desc: 'Objetivos estruturados para garantir progressão cognitiva.' },
                { title: 'Inclusão Integral', desc: 'Metodologias focadas no DUA e ritmos de aprendizagem.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </section>

            {/* Seção de Feedback */}
            <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-800 p-2 rounded-lg">
                      <MessageSquare className="text-white w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Espaço de Escuta Docente</h2>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Sua opinião qualifica nossa ferramenta. Tem alguma sugestão de melhoria ou gostaria de elogiar a sistematização pedagógica? 
                    <span className="block mt-2 font-bold text-emerald-800">Estamos prontos para ouvir você.</span>
                  </p>
                </div>

                <div className="w-full md:w-96">
                  {feedbackStatus === 'success' ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center animate-in zoom-in duration-300">
                      <CheckCircle className="w-10 h-10 text-emerald-800 mx-auto mb-3" />
                      <h3 className="font-bold text-emerald-900">Obrigado pelo Feedback!</h3>
                      <p className="text-xs text-emerald-700 mt-1">Sua contribuição é essencial para nossa evolução.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendFeedback} className="space-y-3">
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Como podemos melhorar sua experiência?"
                        className="w-full h-24 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-800 outline-none transition-all resize-none"
                        disabled={feedbackStatus === 'sending'}
                      />
                      <button
                        type="submit"
                        disabled={feedbackStatus === 'sending' || !feedbackText.trim()}
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
                      >
                        {feedbackStatus === 'sending' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Star className="w-4 h-4" />
                            <span>Enviar Feedback</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
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
