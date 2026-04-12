
import { LessonPlan, SavedLessonPlan, Feedback, UsageLog } from "../types";

const PLAN_STORAGE_KEY = 'gpp_community_plans';
const FEEDBACK_STORAGE_KEY = 'gpp_public_feedback';
const USAGE_LOG_KEY = 'gpp_usage_logs';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const INITIAL_PLANS: Partial<SavedLessonPlan>[] = [
  {
    theme: "Estrutura e Linguagem das Crônicas",
    discipline: "Língua Portuguesa",
    teacherName: "Profª Helena Silveira",
    suggestedMethodology: "Sala de Aula Invertida",
    objectives: ["Identificar elementos narrativos", "Analisar o uso da ironia"],
    knowledgeObject: "Gêneros textuais: a crônica",
    contents: "Gênero Crônica; Elementos da narrativa.",
    methodology: [
      { level: 'Lembrar', activity: "Leitura compartilhada de uma crônica.", cognitiveObjective: "Reconhecer a estrutura do texto." },
      { level: 'Compreender', activity: "Discussão sobre o tema central.", cognitiveObjective: "Interpretar as intenções do autor." }
    ],
    whatWillBeDone: "Leitura e análise de crônicas contemporâneas.",
    howItWillBeDone: "Através de leitura mediada e debate em sala.",
    inclusionProposal: "Disponibilizar versões em áudio e textos com fonte ampliada.",
    dua: "Uso de múltiplos meios de representação (texto, áudio) e expressão (debate, escrita).",
    resources: ["Livro didático", "Projetor"],
    learningEvidence: "Produção textual e participação no debate.",
    assessment: "Observação da participação e análise da produção textual.",
    assessmentInstruments: "Rubrica de avaliação de texto e ficha de observação.",
    activityTips: "1. Criar um mural de crônicas da turma.\n2. Entrevistar funcionários da escola para coletar causos do cotidiano.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const storageService = {
  init: () => {
    if (!localStorage.getItem(PLAN_STORAGE_KEY)) {
      const plans = INITIAL_PLANS.map(p => ({
        ...p,
        id: generateId(),
        ods: ["Educação de Qualidade"],
        socioemotionalSkills: ["Colaboração", "Autonomia"],
      })) as SavedLessonPlan[];
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
    }
  },

  savePlans: (plans: LessonPlan[]): SavedLessonPlan[] => {
    const history = storageService.getHistory();
    const newSavedPlans: SavedLessonPlan[] = plans.map(plan => ({
      ...plan,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify([...newSavedPlans, ...history]));
    return newSavedPlans;
  },

  savePlan: (plan: LessonPlan): SavedLessonPlan => {
    const history = storageService.getHistory();
    const newSavedPlan: SavedLessonPlan = {
      ...plan,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify([newSavedPlan, ...history]));
    return newSavedPlan;
  },

  getHistory: (): SavedLessonPlan[] => {
    try {
      const stored = localStorage.getItem(PLAN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  deletePlan: (id: string): SavedLessonPlan[] => {
    const history = storageService.getHistory();
    const updatedHistory = history.filter(plan => plan.id !== id);
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  },

  saveFeedback: (type: 'sugestao' | 'elogio' | 'erro', name: string, message: string): Feedback => {
    const feedbacks = storageService.getFeedbacks();
    const newFeedback: Feedback = {
      id: generateId(),
      type,
      name,
      message,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([newFeedback, ...feedbacks]));
    return newFeedback;
  },

  getFeedbacks: (): Feedback[] => {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  logUsage: (teacherName: string, prompt: string, plans: LessonPlan[]) => {
    try {
      const logs = storageService.getUsageLogs();
      const newLog: UsageLog = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        teacherName,
        prompt,
        plansCount: plans.length,
        themes: plans.map(p => p.theme)
      };
      localStorage.setItem(USAGE_LOG_KEY, JSON.stringify([newLog, ...logs]));
    } catch (e) {
      console.error("Erro ao registrar log de uso:", e);
    }
  },

  getUsageLogs: (): UsageLog[] => {
    try {
      const stored = localStorage.getItem(USAGE_LOG_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }
};
