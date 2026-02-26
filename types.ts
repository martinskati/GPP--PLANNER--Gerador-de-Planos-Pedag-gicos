
export interface LessonPlan {
  discipline: string;
  content: string;
  objectOfKnowledge: string; // Novo campo padrão SESI
  context: string;
  teacherName: string;
  learningObjectives: string[];
  skills: string[];
  methodology: string;
  development: {
    what: string; // O que será feito?
    how: string;  // Como será feito?
  };
  inclusionStrategies: string;
  learningEvidence: string;
  assessmentInstruments: string;
  ods: string[];
  socioemotionalSkills: string[];
  supportMaterials?: string[]; // Espaço para materiais
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

export interface AppState {
  isGenerating: boolean;
  plan: LessonPlan | null;
  error: string | null;
  showHistory: boolean;
}
