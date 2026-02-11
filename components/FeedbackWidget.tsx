
import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Heart, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sugestao',
    name: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de envio para o backend/email
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ type: 'sugestao', name: '', message: '' });
      
      // Fecha após 3 segundos e reseta o estado de sucesso
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[70] no-print flex items-end flex-col">
      {/* Botão Lateral */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-800 text-white py-4 px-3 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 hover:bg-emerald-900 transition-all group border-y border-l border-emerald-700/50"
        >
          <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-widest">
            Sugestões
          </span>
        </button>
      )}

      {/* Painel de Feedback */}
      {isOpen && (
        <div className="mr-4 w-80 md:w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-800 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquarePlus className="text-white w-5 h-5" />
              <div>
                <h3 className="text-white font-bold text-sm">Canal de Escuta</h3>
                <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider">Apoio ao Docente</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="py-10 text-center animate-in zoom-in duration-300">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-emerald-800 w-10 h-10" />
                </div>
                <h4 className="text-slate-900 font-bold mb-2">Obrigado, Professor(a)!</h4>
                <p className="text-slate-500 text-xs leading-relaxed"> Sua contribuição é fundamental para qualificarmos nossa ferramenta pedagógica.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sugestao', label: 'Sugestão', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { id: 'elogio', label: 'Elogio', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { id: 'erro', label: 'Erro', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        formData.type === type.id 
                          ? 'border-emerald-800 bg-emerald-50 shadow-inner' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <type.icon className={`w-4 h-4 mb-1 ${type.color}`} />
                      <span className="text-[10px] font-bold text-slate-600">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
                    placeholder="Como podemos te chamar?"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sua Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all resize-none"
                    placeholder="Em que podemos melhorar?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
                >
                  {loading ? (
                    <span className="animate-pulse">Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Colaboração</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
              Construindo juntos o futuro da educação.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
