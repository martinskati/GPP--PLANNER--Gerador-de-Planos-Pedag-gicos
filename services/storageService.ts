
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
    objectives: ["Identificar elementos narrativos", "Analisar o uso da ironia"],
    contents: "Gênero Crônica; Elementos da narrativa.",
    methodology: [
      { level: 'Lembrar', activity: "Leitura compartilhada de uma crônica.", cognitiveObjective: "Reconhecer a estrutura do texto." },
      { level: 'Compreender', activity: "Discussão sobre o tema central.", cognitiveObjective: "Interpretar as intenções do autor." }
    ],
    resources: ["Livro didático", "Projetor"],
    assessment: "Produção de um parágrafo reflexivo.",
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
