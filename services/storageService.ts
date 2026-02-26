
import { LessonPlan, SavedLessonPlan, Feedback } from "../types";

const PLAN_STORAGE_KEY = 'gpp_community_plans';
const FEEDBACK_STORAGE_KEY = 'gpp_public_feedback';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const INITIAL_PLANS: Partial<SavedLessonPlan>[] = [
  {
    discipline: "Língua Portuguesa",
    content: "Estrutura e Linguagem das Crônicas",
    objectOfKnowledge: "Elementos da narrativa e gêneros literários.",
    teacherName: "Profª Helena Silveira",
    methodology: "Sala de Aula Invertida",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    development: { 
      what: "Análise de crônicas de Rubem Braga.", 
      how: "Leitura em pares seguida de mapa mental digital." 
    }
  },
  {
    discipline: "Matemática",
    content: "Frações no Cotidiano",
    objectOfKnowledge: "Números racionais e representação fracionária.",
    teacherName: "Prof. Ricardo Mendes",
    methodology: "Gamificação",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    development: { 
      what: "Resolução de desafios em plataforma interativa.", 
      how: "Competição amigável entre grupos usando tablets." 
    }
  }
];

export const storageService = {
  init: () => {
    if (!localStorage.getItem(PLAN_STORAGE_KEY)) {
      const plans = INITIAL_PLANS.map(p => ({
        ...p,
        id: generateId(),
        context: "Exemplo SESI",
        learningObjectives: ["Identificar elementos narrativos"],
        skills: ["EM13LP01.c.17"],
        inclusionStrategies: "DUA: Materiais táteis e audiovisuais.",
        learningEvidence: "Produção de texto autoral.",
        assessmentInstruments: "Rubrica de acompanhamento.",
        ods: ["Educação de Qualidade"],
        socioemotionalSkills: ["Colaboração", "Autonomia"],
        supportMaterials: ["https://exemplo.com/aula-cronica.pdf"]
      })) as SavedLessonPlan[];
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
    }
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
  }
};
