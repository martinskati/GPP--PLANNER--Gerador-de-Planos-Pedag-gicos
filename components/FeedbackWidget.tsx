
import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X, Send, Heart, Lightbulb, AlertTriangle, CheckCircle2, Users, Calendar } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Feedback } from '../types';

const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'wall'>('form');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [formData, setFormData] = useState({
    type: 'sugestao' as 'sugestao' | 'elogio' | 'erro',
    name: '',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFeedbacks(storageService.getFeedbacks());
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      storageService.saveFeedback(formData.type, formData.name, formData.message);
      setLoading(false);
      setSubmitted(true);
      setFormData({ type: 'sugestao', name: '', message: '' });
      setFeedbacks(storageService.getFeedbacks());
      
      setTimeout(() => {
        setSubmitted(false);
        setActiveTab('wall');
      }, 1500);
    }, 800);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'sugestao': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'elogio': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'erro': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[70] no-print flex items-end flex-col">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-800 text-white py-4 px-3 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 hover:bg-emerald-900 transition-all group border-y border-l border-emerald-700/50"
        >
          <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-widest">
            Mural & Sugestões
          </span>
        </button>
      )}

      {isOpen && (
        <div className="mr-4 w-80 md:w-[450px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="bg-emerald-800 p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Users className="text-white w-5 h-5" />
              <div>
                <h3 className="text-white font-bold text-sm">Comunidade GPP</h3>
                <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider">Escuta Pedagógica Ativa</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 shrink-0">
            <button 
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'form' ? 'text-emerald-800 border-b-2 border-emerald-800 bg-emerald-50/50' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Participar
            </button>
            <button 
              onClick={() => setActiveTab('wall')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'wall' ? 'text-emerald-800 border-b-2 border-emerald-800 bg-emerald-50/50' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Mural Público ({feedbacks.length})
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 bg-slate-50/30">
            {activeTab === 'form' ? (
              submitted ? (
                <div className="py-10 text-center animate-in zoom-in duration-300">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-emerald-800 w-10 h-10" />
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">Publicado no Mural!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">Sua voz ajuda a construir uma educação melhor.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sugestao', label: 'Sugestão', icon: Lightbulb, color: 'text-amber-600' },
                      { id: 'elogio', label: 'Elogio', icon: Heart, color: 'text-rose-600' },
                      { id: 'erro', label: 'Erro', icon: AlertTriangle, color: 'text-orange-600' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id as any })}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                          formData.type === type.id 
                            ? 'border-emerald-800 bg-white shadow-sm' 
                            : 'border-slate-100 bg-white/50 hover:border-slate-200'
                        }`}
                      >
                        <type.icon className={`w-4 h-4 mb-1 ${type.color}`} />
                        <span className="text-[10px] font-bold text-slate-600">{type.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assinatura</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
                      placeholder="Seu nome ou cargo..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem para todos</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all resize-none"
                      placeholder="O que você gostaria de compartilhar com a rede?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
                  >
                    {loading ? <span className="animate-pulse">Publicando...</span> : <><Send className="w-4 h-4" /><span>Publicar no Mural</span></>}
                  </button>
                </form>
              )
            ) : (
              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquarePlus className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs font-bold">O mural ainda está vazio. Seja o primeiro!</p>
                  </div>
                ) : (
                  feedbacks.map((f) => (
                    <div key={f.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getBadgeColor(f.type)}`}>
                          {f.type}
                        </span>
                        <span className="text-[9px] text-slate-300 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(f.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm font-medium mb-2 leading-relaxed italic">"{f.message}"</p>
                      <div className="text-[10px] font-bold text-emerald-800 text-right">— {f.name}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="bg-slate-100 p-3 text-center border-t border-slate-200 shrink-0">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Rede de Apoio Docente • Transparência Pedagógica
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
