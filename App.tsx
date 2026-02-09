
import React, { useState, useCallback, useEffect } from 'react';
import { generateLessonPlan } from './services/geminiService';
import { storageService } from './services/storageService';
import { LessonPlan, AppState, SavedLessonPlan } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import PlanResult from './components/PlanResult';
import HistoryDrawer from './components/HistoryDrawer';
import { BookOpen, Send, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
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
      
      // Salva automaticamente no "Banco"
      storageService.savePlan(generatedPlan);
      // Atualiza lista local imediatamente
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

  const handleReset = () => {
    setState({ isGenerating: false, plan: null, error: null, showHistory: false });
    setInputText('');
  };

  const handleSelectHistoryPlan = (savedPlan: SavedLessonPlan) => {
    setState(prev => ({
      ...prev,
      plan: savedPlan,
      showHistory: false, // Fecha o drawer ao selecionar
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
    <div className="min-h-screen flex flex-col text-slate-100 relative">
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
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Card Principal - Preto com detalhes Laranja */}
            <div className="bg-black rounded-2xl shadow-2xl border border-orange-500/20 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-start space-x-4 mb-6 relative z-10">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <BookOpen className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Nova Proposta Pedagógica</h2>
                  <p className="text-slate-400 mt-1">
                    Descreva livremente sua ideia para a aula. Seu plano será gerado, qualificado e 
                    <span className="text-orange-500 font-bold"> salvo automaticamente no seu banco de dados.</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ex: Gostaria de uma aula de história sobre a Revolução Industrial para o 8º ano, focando no impacto nas cidades e usando uma atividade prática de mapa mental..."
                  className="w-full h-48 p-4 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none text-slate-200 placeholder-slate-600 leading-relaxed"
                  disabled={state.isGenerating}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-500">
                    <Info className="w-4 h-4 mr-1 text-orange-500" />
                    Sua autoria intelectual será integralmente preservada.
                  </div>
                  <button
                    type="submit"
                    disabled={state.isGenerating || !inputText.trim()}
                    className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 border border-orange-500/50"
                  >
                    {state.isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sistematizando e Salvando...</span>
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
              <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center">
                <span className="font-medium">Ops!</span>
                <span className="ml-2">{state.error}</span>
              </div>
            )}

            <section className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Banco de Planos', desc: 'Todo plano gerado é salvo automaticamente no seu histórico.' },
                { title: 'Taxonomia de Bloom', desc: 'Objetivos estruturados para garantir progressão cognitiva.' },
                { title: 'Educação Inclusiva', desc: 'Metodologias focadas na diversidade e ritmos de aprendizagem.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-black p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors group">
                  <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
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
