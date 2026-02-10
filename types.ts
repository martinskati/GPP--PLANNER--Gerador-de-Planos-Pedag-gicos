
export interface LessonPlan {
  discipline: string;
  content: string;
  context: string;
  teacherName?: string; // Nome do professor para assinatura
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
}

export interface SavedLessonPlan extends LessonPlan {
  id: string;
  createdAt: string; // ISO Date string
}

export interface AppState {
  isGenerating: boolean;
  plan: LessonPlan | null;
  error: string | null;
  showHistory: boolean;
}
