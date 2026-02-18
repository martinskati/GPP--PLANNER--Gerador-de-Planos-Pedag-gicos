
import { LessonPlan, SavedLessonPlan, Feedback } from "../types";

const PLAN_STORAGE_KEY = 'gpp_community_plans';
const FEEDBACK_STORAGE_KEY = 'gpp_public_feedback';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Dados Iniciais de Exemplo (Semente para a Comunidade)
const INITIAL_PLANS: Partial<SavedLessonPlan>[] = [
  {
    discipline: "Língua Portuguesa",
    content: "Estrutura e Linguagem das Crônicas",
    teacherName: "Profª Helena Silveira",
    methodology: "Sala de Aula Invertida e Produção Coletiva",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
  },
  {
    discipline: "Matemática",
    content: "Frações e Probabilidade no Cotidiano",
    teacherName: "Prof. Ricardo Mendes",
    methodology: "Aprendizagem Baseada em Problemas (PBL)",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
  },
  {
    discipline: "Ciências",
    content: "Sustentabilidade e Energias Renováveis",
    teacherName: "Profª Ana Paula",
    methodology: "Cultura Maker: Construindo um mini gerador eólico",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
  }
];

const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: "f1",
    type: 'elogio',
    name: "Coordenação Pedagógica",
    message: "A sistematização via BNCC e DUA está impecável. Uma ferramenta essencial para nossa rede!",
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: "f2",
    type: 'sugestao',
    name: "Prof. Marcos Lima",
    message: "Seria interessante podermos exportar os planos diretamente para o Google Classroom no futuro.",
    createdAt: new Date(Date.now() - 129600000).toISOString()
  },
  {
    id: "f3",
    type: 'elogio',
    name: "Profª Juliana Rocha",
    message: "Adorei as sugestões de verbos da Taxonomia de Bloom. Facilitou muito meus objetivos!",
    createdAt: new Date(Date.now() - 216000000).toISOString()
  }
];

export const storageService = {
  // Inicialização
  init: () => {
    if (!localStorage.getItem(PLAN_STORAGE_KEY)) {
      const plans = INITIAL_PLANS.map(p => ({
        ...p,
        id: generateId(),
        context: "Exemplo da comunidade",
        learningObjectives: ["Identificar elementos chave", "Analisar criticamente"],
        skills: ["EM13LP01.c.17"],
        development: { what: "Atividade prática", how: "Em grupos de 4" },
        inclusionStrategies: "Uso de material visual e auditivo",
        learningEvidence: "Produção final",
        assessmentInstruments: "Rubrica",
        ods: ["Educação de Qualidade"],
        socioemotionalSkills: ["Colaboração"]
      })) as SavedLessonPlan[];
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
    }
    if (!localStorage.getItem(FEEDBACK_STORAGE_KEY)) {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(INITIAL_FEEDBACKS));
    }
  },

  // Planos Comunitários
  savePlan: (plan: LessonPlan): SavedLessonPlan => {
    const history = storageService.getHistory();
    const newSavedPlan: SavedLessonPlan = {
      ...plan,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedHistory = [newSavedPlan, ...history];
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(updatedHistory));
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

  // Feedbacks Públicos
  saveFeedback: (type: 'sugestao' | 'elogio' | 'erro', name: string, message: string): Feedback => {
    const feedbacks = storageService.getFeedbacks();
    const newFeedback: Feedback = {
      id: generateId(),
      type,
      name,
      message,
      createdAt: new Date().toISOString()
    };
    const updated = [newFeedback, ...feedbacks];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
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
