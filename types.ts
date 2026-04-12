
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
  objectives: string[]; // Verbos Bloom
  contents: string;
  methodology: BloomStep[];
  resources: string[];
  assessment: string;
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
