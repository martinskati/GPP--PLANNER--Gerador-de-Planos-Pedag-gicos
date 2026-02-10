
export interface LessonPlan {
  discipline: string;
  content: string;
  context: string;
  teacherName?: string;
  learningObjectives: string[];
  skills: string[];
  methodology: string;
  development: {
    what: string;
    how: string;
  };
  inclusionStrategies: string;
  learningEvidence: string;
  assessmentInstruments: string;
  ods?: string[]; // Objetivos de Desenvolvimento Sustentável
  socioemotionalSkills?: string[]; // Habilidades Socioemocionais
}

export interface SavedLessonPlan extends LessonPlan {
  id: string;
  createdAt: string;
}

export interface AppState {
  isGenerating: boolean;
  plan: LessonPlan | null;
  error: string | null;
  showHistory: boolean;
}
