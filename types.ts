
export interface BloomStep {
  level: 'Lembrar' | 'Compreender' | 'Aplicar' | 'Analisar' | 'Avaliar' | 'Criar';
  activity: string;
  cognitiveObjective: string;
}

export interface LessonPlan {
  id?: string;
  theme: string;
  discipline: string;
  teacherName: string;
  suggestedMethodology: string; // Metodologia sugerida (ex: PBL, Gamificação)
  objectives: string[]; // Verbos Bloom
  knowledgeObject: string; // Objeto do conhecimento
  contents: string;
  methodology: BloomStep[];
  whatWillBeDone: string; // O que será feito em aula
  howItWillBeDone: string; // Como será feito a aula
  inclusionProposal: string; // Proposta de inclusão (DUA)
  dua: string; // Desenho Universal para Aprendizagem
  resources: string[];
  learningEvidence: string; // Evidências de aprendizagem
  assessment: string; // Instrumentos de avaliação (renamed or kept as assessment)
  assessmentInstruments: string; // Instrumentos de avaliação
  activityTips: string; // Dicas de propostas de atividades
  ods?: string[];
  socioemotionalSkills?: string[];
}

export interface SavedLessonPlan extends LessonPlan {
  id: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  type: 'sugestao' | 'elogio' | 'erro';
  name: string;
  message: string;
  createdAt: string;
}

export interface UsageLog {
  id: string;
  timestamp: string;
  teacherName: string;
  prompt: string;
  plansCount: number;
  themes: string[];
}

export interface AppState {
  isGenerating: boolean;
  plans: LessonPlan[]; // Agora suporta múltiplos planos
  error: string | null;
  showHistory: boolean;
  view: 'app' | 'admin';
}
