
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico de elite especializado no modelo SESI de educação.
Sua tarefa é produzir planos de aula técnicos, objetivos e aplicáveis.

DIRETRIZES RÍGIDAS:
1. PADRÃO SESI: O desenvolvimento DEVE responder explicitamente a: "O que será feito?" e "Como será feito?".
2. OBJETIVIDADE: Não explique a relevância das metodologias nem justifique teorias. 
3. ESTRATÉGIA: A metodologia deve ser apresentada apenas como escolha estratégica direta alinhada ao objetivo.
4. INCLUSÃO: Referencie sempre o DUA (Desenho Universal para Aprendizagem).
5. BLOOM: Use verbos de ação claros para objetivos de aprendizagem.

ESTRUTURA OBRIGATÓRIA:
- ODS Relacionadas (1 a 3).
- Habilidades Socioemocionais mobilizadas.
- Objeto do Conhecimento (claro e direto).
- Evidências de Aprendizagem (resultados observáveis).
- Instrumentos de Avaliação (coerentes com a prática).
`;

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    discipline: { type: Type.STRING },
    content: { type: Type.STRING },
    objectOfKnowledge: { type: Type.STRING, description: "O tópico central de conteúdo." },
    teacherName: { type: Type.STRING },
    ods: { type: Type.ARRAY, items: { type: Type.STRING } },
    socioemotionalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    methodology: { type: Type.STRING, description: "Apenas o nome e a estratégia de aplicação." },
    inclusionStrategies: { type: Type.STRING, description: "Foco em DUA." },
    development: {
      type: Type.OBJECT,
      properties: {
        what: { type: Type.STRING, description: "O que será feito em aula?" },
        how: { type: Type.STRING, description: "Como será feito?" }
      },
      required: ["what", "how"]
    },
    learningEvidence: { type: Type.STRING },
    assessmentInstruments: { type: Type.STRING }
  },
  required: [
    "discipline", "content", "objectOfKnowledge", "ods", 
    "socioemotionalSkills", "learningObjectives", "skills", 
    "methodology", "inclusionStrategies", "development", 
    "learningEvidence", "assessmentInstruments"
  ]
};

export async function generateLessonPlan(teacherText: string, recentMethodologies: string[] = []): Promise<LessonPlan> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY não detectada.");

  const ai = new GoogleGenAI({ apiKey });
  
  const historyContext = recentMethodologies.length > 0 
    ? `METODOLOGIAS_RECENTES (NÃO REPETIR): ${recentMethodologies.join(', ')}`
    : "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: historyContext },
        { text: `Ideia do Professor (SESI Standard): ${teacherText}` }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.3, // Menor temperatura para maior consistência técnica
      },
    });

    const text = response.text;
    if (!text) throw new Error("Falha na geração.");
    
    return JSON.parse(text) as LessonPlan;
  } catch (error: any) {
    throw new Error(error.message || "Erro na geração do plano.");
  }
}
